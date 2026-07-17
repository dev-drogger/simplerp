import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, ok, err } from "neverthrow";
import { GetInventoryError, CreateInventoryError } from "@/types.error";
import { Inventory } from "@/types";

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
