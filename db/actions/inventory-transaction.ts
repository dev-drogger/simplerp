import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, ok, err } from "neverthrow";
import {
  GetInventoryTransactionError,
  CreateInventoryTransactionError,
} from "@/types.error";
import { InventoryTransaction } from "@/types";

export const fetchInventoryTransaction = (): ResultAsync<
  InventoryTransaction[],
  GetInventoryTransactionError
> =>
  ResultAsync.fromPromise(
    db.select().from(schema.inventoryTransactions),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((rows) => {
    const inventory = rows;
    if (!inventory[0])
      return err({
        type: "DB_INVENTORY_TRANSACTION_RETRIEVAL_ERROR" as const,
        error: "We couldn't find any inventory transaction",
      });
    return ok(inventory);
  });

export const insertInventoryTransaction = (
  payload: InventoryTransaction,
): ResultAsync<
  { ok: boolean; message: string },
  CreateInventoryTransactionError
> =>
  ResultAsync.fromPromise(
    db.insert(schema.inventoryTransactions).values(payload).returning(),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((rows) => {
    const [result] = rows;
    if (!result)
      return err({
        type: "DB_INVENTORY_TRANSACTION_CREATION_ERROR" as const,
        error: "We couldn't input this item",
      });
    return ok({ ok: true, message: "created" });
  });
