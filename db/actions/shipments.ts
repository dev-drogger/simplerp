import {
  DatabaseActionReturnType,
  ShipmentInformation,
  ShipmentSummary,
} from "@/types";
import { GetShipmentsError, UpdateShipmentsError } from "@/types.error";
import { ResultAsync, ok, err } from "neverthrow";
import { db } from "../drizzle";
import * as schema from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const getShipmentSummary = (): ResultAsync<
  ShipmentSummary[],
  GetShipmentsError
> =>
  ResultAsync.fromPromise(
    db
      .select({
        date: schema.orders.createdAt,
        orderId: schema.orders.orderId,
        invoice: schema.orders.invoice,
        shipmentId: schema.shipments.shipmentId,
        orderDetails: sql<
          {
            productName: string;
            sku: string;
            quantity: number;
          }[]
        >`
              json_agg(
                json_build_object(
                  'productName', ${schema.products.productName},
                  'sku', ${schema.products.sku},
                  'quantity', ${schema.orderItems.quantity}
                )
              )
            `,
        shipmentDetails: schema.shipments.shipmentDetails,
        shipmentStatus: schema.shipments.shipmentStatus,
      })
      .from(schema.shipments)
      .innerJoin(
        schema.orders,
        eq(schema.orders.orderId, schema.shipments.orderId),
      )
      .innerJoin(
        schema.orderItems,
        eq(schema.orders.orderId, schema.orderItems.orderId),
      )
      .innerJoin(
        schema.products,
        eq(schema.orderItems.sku, schema.products.sku),
      )
      .groupBy(
        schema.shipments.orderId,
        schema.orders.orderId,
        schema.orders.invoice,
        schema.orders.createdAt,
        schema.shipments.shipmentId,
        schema.shipments.shipmentDetails,
        schema.shipments.shipmentStatus,
      ),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((res) => {
    if (!res[0])
      return err({
        type: "DB_SHIPMENTS_RETRIEVAL_ERROR" as const,
        error: "Cannot found the shipment",
      });

    return ok(res);
  });

export const updateShipment = ({
  orderId,
  shipmentId,
  shipmentDetails,
  shipmentStatus,
}: ShipmentInformation): ResultAsync<
  DatabaseActionReturnType,
  UpdateShipmentsError
> =>
  ResultAsync.fromPromise(
    db
      .update(schema.shipments)
      .set({
        shipmentId: shipmentId,
        shipmentDetails: shipmentDetails,
        shipmentStatus: shipmentStatus,
      })
      .where(eq(schema.shipments.orderId, orderId))
      .returning(),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen(([row]) => {
    if (!row)
      return err({
        type: "DB_SHIPMENTS_UPDATE_ERROR" as const,
        error: "We couldn't update the shipment",
      });

    return ok({ ok: true, message: "updated" });
  });
