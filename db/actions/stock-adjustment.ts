import { DatabaseError } from "@/lib/utils";
import { StockAdjustment } from "@/types";
import { inventory } from "../schema";
import { type EmptyRelations, eq } from "drizzle-orm";
import {
  GetInventoryError,
  OnHandError,
  QuantityExceedError,
  UpdateInventoryError,
} from "@/types.error";
import type { PgAsyncTransaction } from "drizzle-orm/pg-core";
import type { NeonQueryResultHKT } from "drizzle-orm/neon-serverless";

export const adjustReservedStock = async (
  tx: PgAsyncTransaction<NeonQueryResultHKT, EmptyRelations>,
  value: StockAdjustment,
) => {
  for (const item of value) {
    const [lockedRow] = await tx
      .select()
      .from(inventory)
      .where(eq(inventory.itemId, item.itemId))
      .for("update");

    if (!lockedRow)
      throw new DatabaseError<GetInventoryError>({
        type: "DB_INVENTORY_RETRIEVAL_ERROR" as const,
        error: "We couldn't find the item",
      });

    const quantityReserved = parseInt(lockedRow.quantityReserved);
    const quantityOnHand = parseInt(lockedRow.quantityOnHand);
    const newReserved = quantityReserved + item.amount;

    if (newReserved > quantityOnHand)
      throw new DatabaseError<QuantityExceedError>({
        type: "QUANTITY_RESERVED_EXCEED" as const,
        error: `Out of stock`,
      });

    if (newReserved < 0)
      throw new DatabaseError<QuantityExceedError>({
        type: "QUANTITY_RESERVED_EXCEED" as const,
        error: "Cannot release more than what is currently reserved",
      });

    const [row] = await tx
      .update(inventory)
      .set({ quantityReserved: String(newReserved) })
      .where(eq(inventory.itemId, item.itemId))
      .returning();

    if (!row)
      throw new DatabaseError<UpdateInventoryError>({
        type: "DB_INVENTORY_UPDATE_ERROR" as const,
        error: "We couldn't update the inventory",
      });
  }
};

export const adjustOnHandStock = async (
  tx: PgAsyncTransaction<NeonQueryResultHKT, EmptyRelations>,
  value: StockAdjustment,
) => {
  for (const item of value) {
    const [lockedRow] = await tx
      .select()
      .from(inventory)
      .where(eq(inventory.itemId, item.itemId))
      .for("update");

    if (!lockedRow)
      throw new DatabaseError<GetInventoryError>({
        type: "DB_INVENTORY_RETRIEVAL_ERROR" as const,
        error: "We couldn't find the item",
      });

    const quantityReserved = parseInt(lockedRow.quantityReserved);
    const quantityOnHand = parseInt(lockedRow.quantityOnHand);
    const newOnHand = quantityOnHand + item.amount;

    if (newOnHand < quantityReserved)
      throw new DatabaseError<OnHandError>({
        type: "INSUFFICIENT_ON_HAND_QUANTITY" as const,
        error: `Out of stock. Only ${quantityOnHand} product available.`,
      });

    if (newOnHand < 0)
      throw new DatabaseError<OnHandError>({
        type: "INSUFFICIENT_ON_HAND_QUANTITY" as const,
        error: "Out of stock",
      });

    const [row] = await tx
      .update(inventory)
      .set({ quantityOnHand: String(newOnHand) })
      .where(eq(inventory.itemId, item.itemId))
      .returning();

    if (!row)
      throw new DatabaseError<UpdateInventoryError>({
        type: "DB_INVENTORY_UPDATE_ERROR" as const,
        error: "We couldn't update the inventory",
      });
  }
};
