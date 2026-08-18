import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, ok, err } from "neverthrow";
import { CreateInventoryTransactionError } from "@/types.error";
import { DatabaseActionReturnType, InventoryTransactions } from "@/types";

export const insertInventoryTransaction = (
  payload: InventoryTransactions[],
): ResultAsync<DatabaseActionReturnType, CreateInventoryTransactionError> =>
  ResultAsync.fromPromise(
    db.insert(schema.inventoryTransactions).values(payload).returning(),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((rows) => {
    const result = rows;
    if (!result[0])
      return err({
        type: "DB_INVENTORY_TRANSACTION_CREATION_ERROR" as const,
        error: "We couldn't adjust the stock",
      });
    return ok({ ok: true, message: "created" });
  });
