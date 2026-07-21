import {} from "drizzle-orm/errors";
import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, err, ok } from "neverthrow";
import { PlaceOrder } from "@/types";
import { NewPlaceOrderError, PlaceOrderError } from "@/types.error";
import { eq, sql } from "drizzle-orm";
import { mapDatabaseError } from "@/lib/utils";

const TABLE_TO_ERROR: Record<string, NewPlaceOrderError> = {
  customers: {
    type: "DB_CUSTOMER_CREATION_ERROR",
    error: "We couldn't add this customer",
  },
  orders: {
    type: "DB_ORDER_CREATION_ERROR",
    error: "We couldn't add this order",
  },
  order_items: {
    type: "DB_ORDER_ITEMS_CREATION_ERROR",
    error: "We couldn't add the order items",
  },
  inventory: {
    type: "DB_INVENTORY_UPDATE_ERROR",
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

export const newMapDatabaseError = (e: unknown): NewPlaceOrderError => {
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
      if (!customerRow) tx.rollback();

      const [orderRow] = await tx
        .insert(schema.orders)
        .values(order)
        .returning();
      if (!orderRow) tx.rollback();

      const orderItemsRows = await tx
        .insert(schema.orderItems)
        .values(items)
        .returning();
      if (!orderItemsRows) tx.rollback();

      return { customerRow, orderRow, orderItemsRows };
    }),
    (e) => mapDatabaseError(e),
  ).andThen(({ customerRow, orderRow, orderItemsRows }) => {
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

    return ok({ ok: true, message: "created" });
  });

export const newPlaceOrder = (
  { order, customer, items }: PlaceOrder,
  payload: { itemId: number; amount: number }[],
): ResultAsync<{ ok: boolean; message: string }, NewPlaceOrderError> =>
  ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const [customerRow] = await tx
        .insert(schema.customers)
        .values(customer)
        .returning();
      if (!customerRow) tx.rollback();

      const [orderRow] = await tx
        .insert(schema.orders)
        .values(order)
        .returning();
      if (!orderRow) tx.rollback();

      const orderItemsRows = await tx
        .insert(schema.orderItems)
        .values(items)
        .returning();
      if (!orderItemsRows) tx.rollback();

      const inventoryRows = await tx.transaction(async (tx2) => {
        const result = [];
        for (const item of payload) {
          const [row] = await tx2
            .update(schema.inventory)
            .set({
              quantityReserved: sql`${schema.inventory.quantityReserved} + ${item.amount}`,
            })
            .where(eq(schema.inventory.itemId, item.itemId))
            .returning();

          if (!row) {
            tx2.rollback();
            tx.rollback();
          }
          result.push(row);
        }

        return result;
      });

      return { customerRow, orderRow, orderItemsRows, inventoryRows };
    }),
    (e) => newMapDatabaseError(e),
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
