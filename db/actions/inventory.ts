import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, ok, err } from "neverthrow";
import {
  GetInventoryError,
  CreateInventoryError,
  UpdateInventoryError,
} from "@/types.error";
import { Inventory, InventorySummary } from "@/types";
import { eq, sql } from "drizzle-orm";

export const fetchInventory = (): ResultAsync<Inventory[], GetInventoryError> =>
  ResultAsync.fromPromise(db.select().from(schema.inventory), () => ({
    type: "DATABASE_ERROR" as const,
    error: "Unexpected error",
  })).andThen((rows) => {
    const inventory = rows;
    if (!inventory[0])
      return err({
        type: "DB_INVENTORY_RETRIEVAL_ERROR" as const,
        error: "We couldn't find any items",
      });
    return ok(inventory);
  });

export const fetchInventorySummary = (): ResultAsync<
  InventorySummary[],
  GetInventoryError
> =>
  ResultAsync.fromPromise(
    db
      .select({
        itemId: schema.inventoryItems.itemId,
        name: schema.inventoryItems.name,
        type: schema.inventoryItems.type,
        quantityOnHand: schema.inventory.quantityOnHand,
        quantityReserved: schema.inventory.quantityReserved,
        status: schema.inventory.status,
      })
      .from(schema.inventory)
      .innerJoin(
        schema.inventoryItems,
        eq(schema.inventoryItems.itemId, schema.inventory.itemId),
      ),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((rows) => {
    const inventory = rows;
    if (!inventory[0])
      return err({
        type: "DB_INVENTORY_RETRIEVAL_ERROR" as const,
        error: "We couldn't find any items",
      });
    return ok(inventory);
  });

export const insertInventory = (
  payload: Inventory,
): ResultAsync<{ ok: boolean; message: string }, CreateInventoryError> =>
  ResultAsync.fromPromise(
    db.insert(schema.inventory).values(payload).returning(),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((rows) => {
    const [result] = rows;
    if (!result)
      return err({
        type: "DB_INVENTORY_CREATION_ERROR" as const,
        error: "We couldn't input this item",
      });
    return ok({ ok: true, message: "created" });
  });

export const updateInventory = (
  payload: { itemId: number; amount: number }[],
): ResultAsync<{ ok: boolean; message: string }, UpdateInventoryError> => {
  return ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const result = [];
      for (const item of payload) {
        const [row] = await tx
          .update(schema.inventory)
          .set({
            quantityReserved: sql`${schema.inventory.quantityReserved} + ${item.amount}`,
          })
          .where(eq(schema.inventory.itemId, item.itemId))
          .returning();

        if (!row) tx.rollback();
        result.push(row);
      }
      return result;
    }),
    () => {
      return {
        type: "DATABASE_ERROR" as const,
        error: "Unexpected error",
      };
    },
  ).andThen((rows) => {
    const result = rows;
    if (!result[0])
      return err({
        type: "DB_INVENTORY_UPDATE_ERROR" as const,
        error: "We couldn't input this item",
      });
    return ok({ ok: true, message: "created" });
  });
};
