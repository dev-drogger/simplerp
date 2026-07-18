import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, ok, err } from "neverthrow";
import { GetProductsError } from "@/types.error";
import { Product } from "@/types";

export const fetchProducts = (): ResultAsync<Product[], GetProductsError> =>
  ResultAsync.fromPromise(db.select().from(schema.products), () => ({
    type: "DATABASE_ERROR" as const,
    error: "Unexpected error",
  })).andThen((rows) => {
    const products = rows;
    if (!products[0])
      return err({
        type: "DB_PRODUCTS_RETRIEVAL_ERROR" as const,
        error: "We couldn't find any product",
      });
    return ok(products);
  });
