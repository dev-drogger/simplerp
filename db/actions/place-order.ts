import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync } from "neverthrow";
import { PlaceOrder } from "@/types";
import { PlaceOrderError } from "@/types.error";

export const insertPlaceOrder = ({
  order,
  customer,
  items,
}: PlaceOrder): ResultAsync<
  { ok: boolean; message: string },
  PlaceOrderError
> =>
  ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const [customerRow] = await tx
        .insert(schema.customers)
        .values(customer)
        .returning();

      if (!customerRow) {
        throw {
          type: "DB_CUSTOMER_CREATION_ERROR" as const,
          error: "We couldn't add this customer",
        };
      }

      const [orderRow] = await tx
        .insert(schema.orders)
        .values(order)
        .returning();

      if (!orderRow) {
        throw {
          type: "DB_ORDER_CREATION_ERROR" as const,
          error: "We couldn't add this order",
        };
      }

      const orderItemsRows = await tx
        .insert(schema.orderItems)
        .values(items)
        .returning();

      if (orderItemsRows.length === 0) {
        throw {
          type: "DB_ORDER_ITEMS_CREATION_ERROR" as const,
          error: "We couldn't add the order items",
        };
      }

      return {
        ok: true,
        message: "created",
      };
    }),
    (e): PlaceOrderError =>
      typeof e === "object" && e !== null && "type" in e
        ? (e as PlaceOrderError)
        : {
            type: "DATABASE_ERROR",
            error: "Unexpected error",
          },
  );
