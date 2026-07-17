import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, ok, err } from "neverthrow";
import {
  GetProductsError,
  CreateProductsError,
  UpdateProductsError,
  DeleteProductsError,
} from "@/types.error";

export const fetchProducts = (): ResultAsync<
  schema.Products[],
  GetProductsError
> =>
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

// export const fetchGameData = (
//   level: number,
//   type: PlanTypeEnum,
// ): ResultAsync<GameDataReturnType, GetGameDataError> =>
//   ResultAsync.fromPromise(
//     Promise.all([
//       db
//         .select({ upgrades: schema.initialPlan.upgrades })
//         .from(schema.initialPlan)
//         .where(
//           and(
//             eq(schema.initialPlan.level, level),
//             eq(schema.initialPlan.type, type),
//           ),
//         ),
//       db
//         .select({ entities: schema.entityValidation.entities })
//         .from(schema.entityValidation)
//         .where(
//           and(
//             eq(schema.entityValidation.level, level),
//             eq(schema.entityValidation.type, type),
//           ),
//         ),
//       db.select().from(schema.entityReference),
//     ]),
//     () => ({
//       type: "DATABASE_ERROR" as const,
//       error: "Unexpected error",
//     }),
//   ).andThen(([planRows, validationRows, referenceRows]) => {
//     const [plan] = planRows;
//     const [validation] = validationRows;
//     const reference = referenceRows;

//     if (!plan || !plan.upgrades)
//       return err({
//         type: "DB_INITIAL_PLAN_ERR" as const,
//         error: "CoC game data unavailable",
//       });
//     if (!validation || !validation.entities) {
//       return err({
//         type: "DB_ENTITY_VALIDATION_ERR" as const,
//         error: "We couldn't verify village data",
//       });
//     }
//     if (!reference[0])
//       return err({
//         type: "DB_ENTITY_REFERENCE_ERR" as const,
//         error: "We couldn't verify village data",
//       });

//     return ok({
//       plan: plan.upgrades as Instance[],
//       entities: validation.entities as EntityValidationType[],
//       reference,
//     });
//   });
