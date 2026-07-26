import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, ok, err } from "neverthrow";
import {
  GetInventoryError,
  CreateInventoryError,
  UpdateInventoryError,
} from "@/types.error";
import { Inventory, InventorySummary, ReserveQuantity } from "@/types";
import { eq, sql } from "drizzle-orm";
import { DatabaseError, mapDatabaseError } from "@/lib/utils";

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

export const restockInventory = (payload: {
  items: ReserveQuantity;
}): ResultAsync<{ ok: boolean; message: string }, UpdateInventoryError> => {
  return ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const { items } = payload;
      for (const item of items) {
        const [row] = await tx
          .update(schema.inventory)
          .set({
            quantityOnHand: sql`${schema.inventory.quantityOnHand} + ${item.amount}`,
          })
          .where(eq(schema.inventory.itemId, item.itemId))
          .returning();

        if (!row)
          throw new DatabaseError<UpdateInventoryError>({
            type: "DB_INVENTORY_UPDATE_ERROR",
            error: "We couldn't update the the inventory",
          });
      }

      return { ok: true, message: "updated" } as const;
    }),
    (e) => mapDatabaseError(e),
  );
};
