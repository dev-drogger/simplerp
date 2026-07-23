import {} from "drizzle-orm/errors";
import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, err, ok } from "neverthrow";
import { DatabaseActionReturnType, PlaceOrder, ReserveQuantity } from "@/types";
import {
  DatabaseError,
  DeletePlacedOrderError,
  PlaceOrderError,
} from "@/types.error";
import { eq, sql } from "drizzle-orm";

const TABLE_TO_ERROR: Record<string, PlaceOrderError> = {
  customers: {
    type: "DB_CUSTOMER_CREATION_ERROR" as const,
    error: "We couldn't add this customer",
  },
  orders: {
    type: "DB_ORDER_CREATION_ERROR" as const,
    error: "We couldn't add this order",
  },
  order_items: {
    type: "DB_ORDER_ITEMS_CREATION_ERROR" as const,
    error: "We couldn't add the order items",
  },
  inventory: {
    type: "DB_INVENTORY_UPDATE_ERROR" as const,
    error: "We couldn't update the inventory",
  },
};
const TEST: Record<string, DeletePlacedOrderError> = {
  orders: {
    type: "DB_ORDER_DELETION_ERROR" as const,
    error: "We couldn't delete this order",
  },
  inventory: {
    type: "DB_INVENTORY_UPDATE_ERROR" as const,
    error: "We couldn't update the inventory",
  },
};

const parseDatabaseError = (e: unknown): string | undefined => {
  if (
    typeof e === "object" &&
    e !== null &&
    "cause" in e &&
    typeof e.cause === "object" &&
    e.cause !== null &&
    "table" in e.cause
  ) {
    return String((e.cause as { table: unknown }).table);
  }
  return undefined;
};

export function errorMapper<T extends { type: string; error: string }>(
  e: unknown,
  tableMap: Record<string, T>,
): T {
  const table = parseDatabaseError(e);
  const mapped = table ? tableMap[table] : undefined;
  return (
    mapped ??
    ({
      type: "DATABASE_ERROR",
      error: "Unexpected error",
    } as T)
  );
}

export const mapDatabaseError = (e: unknown): PlaceOrderError => {
  const table = parseDatabaseError(e);
  const mapped = table ? TABLE_TO_ERROR[table] : undefined;
  return (
    mapped ?? {
      type: "DATABASE_ERROR",
      error: "Unexpected error",
    }
  );
};

export const insertPlaceOrder = ({
  order,
  customer,
  items,
  reserveQuantity,
}: PlaceOrder): ResultAsync<DatabaseActionReturnType, PlaceOrderError> =>
  ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const [customerRow] = await tx
        .insert(schema.customers)
        .values(customer)
        .returning();
      if (!customerRow) return tx.rollback();

      const [orderRow] = await tx
        .insert(schema.orders)
        .values(order)
        .returning();
      if (!orderRow) return tx.rollback();

      const orderItemsRows = await tx
        .insert(schema.orderItems)
        .values(items)
        .returning();
      if (!orderItemsRows[0]) return tx.rollback();

      const inventoryRows = [];
      for (const item of reserveQuantity) {
        const [row] = await tx
          .update(schema.inventory)
          .set({
            quantityReserved: sql`${schema.inventory.quantityReserved} + ${item.amount}`,
          })
          .where(eq(schema.inventory.itemId, item.itemId))
          .returning();

        if (!row) return tx.rollback();

        inventoryRows.push(row);
      }

      return { customerRow, orderRow, orderItemsRows, inventoryRows };
    }),
    (e) => mapDatabaseError(e),
  ).andThen(({ customerRow, orderRow, orderItemsRows, inventoryRows }) => {
    if (!customerRow)
      return err({
        type: "DB_CUSTOMER_CREATION_ERROR" as const,
        error: "We couldn't add this customer",
      });
    if (!orderRow)
      return err({
        type: "DB_ORDER_CREATION_ERROR" as const,
        error: "We couldn't add this order",
      });
    if (orderItemsRows.length === 0)
      return err({
        type: "DB_ORDER_ITEMS_CREATION_ERROR" as const,
        error: "We couldn't add the order items",
      });
    if (inventoryRows.length === 0)
      return err({
        type: "DB_INVENTORY_UPDATE_ERROR" as const,
        error: "We couldn't update the inventory",
      });

    return ok({ ok: true, message: "created" });
  });

export const deletePlacedOrder = ({
  orderId,
  materials,
}: {
  orderId: string;
  materials: ReserveQuantity;
}): ResultAsync<DatabaseActionReturnType, DeletePlacedOrderError> =>
  ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const inventoryRows = [];
      for (const item of materials) {
        const [row] = await tx
          .update(schema.inventory)
          .set({
            quantityReserved: sql`${schema.inventory.quantityReserved} - ${item.amount}`,
          })
          .where(eq(schema.inventory.itemId, item.itemId))
          .returning();

        if (!row) {
          tx.rollback();
        }
        inventoryRows.push(row);
      }

      const [orderRow] = await tx
        .delete(schema.orders)
        .where(eq(schema.orders.orderId, orderId))
        .returning();

      if (!orderRow) {
        tx.rollback();
      }

      return { inventoryRows, orderRow };
    }),
    (e) => errorMapper(e, TEST),
  ).andThen(({ inventoryRows, orderRow }) => {
    if (!orderRow)
      return err({
        type: "DB_ORDER_DELETION_ERROR" as const,
        error: "We couldn't add this order",
      });
    if (inventoryRows.length === 0)
      return err({
        type: "DB_INVENTORY_UPDATE_ERROR" as const,
        error: "We couldn't update the inventory",
      });

    return ok({ ok: true, message: "created" });
  });
