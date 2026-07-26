import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, ok, err } from "neverthrow";
import { asc, eq, sql } from "drizzle-orm";

import {
  OrderSummary,
  OrderStatus,
  DatabaseActionReturnType,
  ReserveQuantity,
} from "@/types";
import {
  UpdateOrderError,
  UpdateInventoryError,
  GetOrderError,
} from "@/types.error";
import { DatabaseError, mapDatabaseError } from "@/lib/utils";

export const fetchOrderSummary = (): ResultAsync<
  OrderSummary[],
  GetOrderError
> =>
  ResultAsync.fromPromise(
    db
      .select({
        orderId: schema.orders.orderId,
        customerName: schema.customers.customerName,
        invoice: schema.orders.invoice,
        date: schema.orders.createdAt,
        amount: schema.orders.grandTotal,
        status: schema.orders.status,
        items: sql<
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
      })
      .from(schema.orders)
      .innerJoin(
        schema.customers,
        eq(schema.orders.customerId, schema.customers.customerId),
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
        schema.orders.orderId,
        schema.customers.customerName,
        schema.orders.invoice,
        schema.orders.createdAt,
        schema.orders.grandTotal,
        schema.orders.status,
      )
      .orderBy(asc(schema.orders.createdAt)),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((rows) => {
    const products = rows;
    if (!products[0])
      return err({
        type: "DB_ORDER_RETRIEVAL_ERROR" as const,
        error: "We couldn't find any order",
      });
    return ok(products);
  });

export const updateOrderStatus = (payload: {
  orderId: string;
  status: string;
  materials: ReserveQuantity;
}): ResultAsync<
  DatabaseActionReturnType,
  UpdateOrderError | UpdateInventoryError
> =>
  ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const [orderRow] = await tx
        .update(schema.orders)
        .set({ status: payload.status as OrderStatus })
        .where(eq(schema.orders.orderId, payload.orderId))
        .returning();

      if (!orderRow)
        throw new DatabaseError<UpdateOrderError>({
          type: "DB_ORDER_UPDATE_ERROR",
          error: "We couldn't update the order status",
        });

      for (const item of payload.materials) {
        let updateValues;

        switch (payload.status) {
          case "completed":
            updateValues = {
              quantityReserved: sql`${schema.inventory.quantityReserved} - ${item.amount}`,
              quantityOnHand: sql`${schema.inventory.quantityOnHand} - ${item.amount}`,
            };
            break;

          case "returned":
          case "cancelled":
            updateValues = {
              quantityReserved: sql`${schema.inventory.quantityReserved} - ${item.amount}`,
            };
            break;

          default:
            throw new Error(`Unsupported status: ${payload.status}`);
        }

        const [row] = await tx
          .update(schema.inventory)
          .set(updateValues)
          .where(eq(schema.inventory.itemId, item.itemId))
          .returning();

        if (!row)
          throw new DatabaseError<UpdateInventoryError>({
            type: "DB_INVENTORY_UPDATE_ERROR",
            error: "We couldn't update the inventory",
          });
      }

      return { ok: true, message: "updated" };
    }),
    (e) => mapDatabaseError(e),
  );
