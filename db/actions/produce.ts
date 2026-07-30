import { DatabaseError, mapDatabaseError } from "@/lib/utils";
import { eq, sql } from "drizzle-orm";
import { DatabaseActionReturnType, StockAmount } from "@/types";
import {
  UpdateInventoryError,
  GetProductsError,
  StockError,
} from "@/types.error";
import { ResultAsync } from "neverthrow";
import { db } from "../drizzle";
import * as schema from "@/db/schema";
import { adjustOnHandStock } from "./stock-adjustment";

export const insertProducedQuantity = ({
  materials,
  products,
}: {
  materials: StockAmount;
  products: {
    sku: string;
    quantity: number;
  }[];
}): ResultAsync<DatabaseActionReturnType, GetProductsError | StockError> =>
  ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      for (const i of products) {
        const [lockedRow] = await tx
          .select({ itemId: schema.products.itemId })
          .from(schema.products)
          .where(eq(schema.products.sku, i.sku));

        if (!lockedRow)
          throw new DatabaseError<GetProductsError>({
            type: "DB_PRODUCTS_RETRIEVAL_ERROR",
            error: "Products not found",
          });

        const [row] = await tx
          .update(schema.inventory)
          .set({
            quantityOnHand: sql`${schema.inventory.quantityOnHand} + ${i.quantity}`,
          })
          .where(eq(schema.inventory.itemId, lockedRow.itemId))
          .returning();

        if (!row)
          throw new DatabaseError<UpdateInventoryError>({
            type: "DB_INVENTORY_UPDATE_ERROR",
            error: "Products not found",
          });
      }

      await adjustOnHandStock(tx, materials);
      return { ok: true, message: "updated" };
    }),
    (e) => mapDatabaseError(e),
  );
