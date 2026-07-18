import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, ok, err } from "neverthrow";
import { eq, sql, inArray, and, InferSelectModel } from "drizzle-orm";

import {
  GetProductsError,
  CreateProductsError,
  UpdateProductsError,
  DeleteProductsError,
  GetOrderError,
  CreateOrderError,
} from "@/types.error";
import { Order, OrderSummary } from "@/types";

export const fetchOrderSummary = (): ResultAsync<
  OrderSummary[],
  GetOrderError
> =>
  ResultAsync.fromPromise(
    db
      .select({
        customerName: schema.customers.customerName,
        orderId: schema.orders.orderId,
        invoice: schema.orders.invoice,
        date: schema.orders.createdAt,
        amount: schema.orders.grandTotal,
        status: schema.orders.status,
        items: sql<
          {
            productName: string;
            quantity: number;
          }[]
        >`
      json_agg(
        json_build_object(
          'productName', ${schema.products.productName},
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
        schema.customers.customerName,
        schema.orders.orderId,
        schema.orders.invoice,
        schema.orders.createdAt,
        schema.orders.grandTotal,
        schema.orders.status,
      ),
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

export const insertOrder = (
  order: Order,
): ResultAsync<{ ok: boolean; message: string }, CreateOrderError> =>
  ResultAsync.fromPromise(
    db.insert(schema.orders).values(order).returning(),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((rows) => {
    const [result] = rows;
    if (!result)
      return err({
        type: "DB_ORDER_CREATION_ERROR" as const,
        error: "We couldn't find any order",
      });
    return ok({ ok: true, message: "created" });
  });
