import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync } from "neverthrow";
import { DatabaseActionReturnType, PlaceOrder, ReserveQuantity } from "@/types";
import { DeletePlacedOrderError, PlaceOrderError } from "@/types.error";
import { eq, sql } from "drizzle-orm";
import { DatabaseError, mapDatabaseError } from "@/lib/utils";
import { adjustReservedStock } from "./stock-adjustment";

export const insertPlaceOrder = ({
  order,
  customer,
  orderItems,
  reserveQuantity,
}: PlaceOrder): ResultAsync<DatabaseActionReturnType, PlaceOrderError> =>
  ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const [customerRow] = await tx
        .insert(schema.customers)
        .values(customer)
        .returning();
      if (!customerRow)
        throw new DatabaseError<PlaceOrderError>({
          type: "DB_CUSTOMER_CREATION_ERROR" as const,
          error: "We couldn't add this customer",
        });

      const [orderRow] = await tx
        .insert(schema.orders)
        .values(order)
        .returning();
      if (!orderRow)
        throw new DatabaseError<PlaceOrderError>({
          type: "DB_ORDER_CREATION_ERROR" as const,
          error: "We couldn't add the order",
        });

      const orderItemsRows = await tx
        .insert(schema.orderItems)
        .values(orderItems)
        .returning();
      if (!orderItemsRows[0])
        throw new DatabaseError<PlaceOrderError>({
          type: "DB_ORDER_ITEMS_CREATION_ERROR" as const,
          error: "We couldn't add the order items",
        });

      await adjustReservedStock(tx, reserveQuantity);

      return { ok: true, message: "created" } as const;
    }),
    (e) => mapDatabaseError(e),
  );

export const deletePlacedOrder = ({
  orderId,
  materials,
}: {
  orderId: string;
  materials: ReserveQuantity;
}): ResultAsync<DatabaseActionReturnType, DeletePlacedOrderError> =>
  ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      for (const item of materials) {
        const [row] = await tx
          .update(schema.inventory)
          .set({
            quantityReserved: sql`${schema.inventory.quantityReserved} - ${item.amount}`,
          })
          .where(eq(schema.inventory.itemId, item.itemId))
          .returning();

        if (!row)
          throw new DatabaseError<DeletePlacedOrderError>({
            type: "DB_INVENTORY_UPDATE_ERROR" as const,
            error: "We couldn't update the inventory",
          });
      }

      const [orderRow] = await tx
        .delete(schema.orders)
        .where(eq(schema.orders.orderId, orderId))
        .returning();

      if (!orderRow)
        throw new DatabaseError<DeletePlacedOrderError>({
          type: "DB_ORDER_DELETION_ERROR" as const,
          error: "We couldn't delete the order",
        });

      return { ok: true, message: "deleted" } as const;
    }),
    (e) => mapDatabaseError<DeletePlacedOrderError>(e),
  );
