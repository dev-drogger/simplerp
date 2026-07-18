import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, ok, err } from "neverthrow";
import { CreateOrderItemsError } from "@/types.error";
import { OrderItems } from "@/types";

export const insertOrderItems = (
  orderItems: OrderItems,
): ResultAsync<{ ok: boolean; message: string }, CreateOrderItemsError> =>
  ResultAsync.fromPromise(
    db.insert(schema.orderItems).values(orderItems).returning(),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((rows) => {
    const [orderItems] = rows;
    if (!orderItems)
      return err({
        type: "DB_ORDER_ITEMS_CREATION_ERROR" as const,
        error: "We couldn't add the order items",
      });
    return ok({ ok: true, message: "created" });
  });
