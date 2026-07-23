import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, ok, err } from "neverthrow";
import { eq, sql } from "drizzle-orm";

import { GetOrderError } from "@/types.error";
import { OrderSummary } from "@/types";

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
        schema.orders.orderId,
        schema.customers.customerName,
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
