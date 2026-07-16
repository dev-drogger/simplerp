import { db } from "@/db/drizzle";
import { eq, inArray, and } from "drizzle-orm";
import * as schema from "@/db/schema";
import { ResultAsync, ok, err } from "neverthrow";
import { z } from "zod";
import {
  GetProductsError,
  CreateProductsError,
  UpdateProductsError,
  DeleteProductsError,
} from "@/types.error";

export const fetchProducts = (
  type: PlanTypeEnum,
  tag: string,
): ResultAsync<PlanType, GetPlanError> =>
  ResultAsync.fromPromise(
    db
      .select({
        tag: schema.plan.tag,
        type: schema.plan.type,
        upgrades: schema.plan.upgrades,
        buildings: schema.plan.buildings,
        completedUpgrades: schema.plan.completedUpgrades,
      })
      .from(schema.plan)
      .where(and(eq(schema.plan.type, type), eq(schema.plan.tag, tag))),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((rows) => {
    const [plan] = rows;
    if (!plan)
      return err({
        type: "DB_PLAN_RETRIEVAL_ERR" as const,
        error: "We couldn't find your plan",
      });
    return ok(plan as PlanType);
  });

export const fetchInitialPlan = (
  level: number,
): ResultAsync<Instance[], GetInitialPlanError> =>
  ResultAsync.fromPromise(
    db
      .select({ plan: schema.initialPlan.upgrades })
      .from(schema.initialPlan)
      .where(eq(schema.initialPlan.level, level)),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((rows) => {
    const plan = rows;
    if (!plan[0] || !plan[0].plan)
      return err({
        type: "DB_INITIAL_PLAN_ERR" as const,
        error: "CoC game data unavailable",
      });

    return ok(plan[0].plan as Instance[]);
  });

export const fetchMissingData = (
  payload: Array<string>,
): ResultAsync<Instance[], GetMissingInstanceError> =>
  ResultAsync.fromPromise(
    db
      .select({
        instanceId: schema.instances.instanceId,
        instanceName: schema.instances.instanceName,
        instanceNumber: schema.instances.instanceNumber,
        townHallLevel: schema.instances.townHallLevel,
        level: schema.instances.level,
        duration: schema.instances.duration,
        cost: schema.instances.cost,
        dependencies: schema.instances.dependencies,
        entityTypeId: schema.instances.entityTypeId,
        resourceTypeId: schema.instances.resourceTypeId,
      })
      .from(schema.instances)
      .where(inArray(schema.instances.instanceId, payload)),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((rows) => {
    const data = rows;
    if (!data[0])
      return err({
        type: "DB_MISSING_DATA_ERR" as const,
        error: "CoC game data unavailable",
      });

    return ok(data as Instance[]);
  });

export const checkExistingTag = (
  tag: string,
): ResultAsync<{ ok: boolean; message: string }, TagExistError> =>
  ResultAsync.fromPromise(
    db
      .select()
      .from(schema.userProfiles)
      .where(eq(schema.userProfiles.tag, tag)),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((rows) => {
    const [exists] = rows;
    if (exists)
      return err({
        type: "TAG_EXIST" as const,
        error: "An account using this data already exists",
      });

    return ok({ ok: true, message: "no duplicate" });
  });

export const fetchGameData = (
  level: number,
  type: PlanTypeEnum,
): ResultAsync<GameDataReturnType, GetGameDataError> =>
  ResultAsync.fromPromise(
    Promise.all([
      db
        .select({ upgrades: schema.initialPlan.upgrades })
        .from(schema.initialPlan)
        .where(
          and(
            eq(schema.initialPlan.level, level),
            eq(schema.initialPlan.type, type),
          ),
        ),
      db
        .select({ entities: schema.entityValidation.entities })
        .from(schema.entityValidation)
        .where(
          and(
            eq(schema.entityValidation.level, level),
            eq(schema.entityValidation.type, type),
          ),
        ),
      db.select().from(schema.entityReference),
    ]),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen(([planRows, validationRows, referenceRows]) => {
    const [plan] = planRows;
    const [validation] = validationRows;
    const reference = referenceRows;

    if (!plan || !plan.upgrades)
      return err({
        type: "DB_INITIAL_PLAN_ERR" as const,
        error: "CoC game data unavailable",
      });
    if (!validation || !validation.entities) {
      return err({
        type: "DB_ENTITY_VALIDATION_ERR" as const,
        error: "We couldn't verify village data",
      });
    }
    if (!reference[0])
      return err({
        type: "DB_ENTITY_REFERENCE_ERR" as const,
        error: "We couldn't verify village data",
      });

    return ok({
      plan: plan.upgrades as Instance[],
      entities: validation.entities as EntityValidationType[],
      reference,
    });
  });

export const checkExistingPlan = (
  tag: string,
  type: PlanTypeEnum,
): ResultAsync<{ ok: boolean; message: string }, PlanExistError> =>
  ResultAsync.fromPromise(
    db
      .select()
      .from(schema.plan)
      .where(and(eq(schema.plan.type, type), eq(schema.plan.tag, tag))),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((rows) => {
    const [plan] = rows;
    if (plan && plan.type === "night")
      return err({
        type: "NIGHT_PLAN_EXIST" as const,
        error: "An upgrade plan using this data already exists",
      });
    if (!plan && type === "day")
      return err({
        type: "DAY_PLAN_NOT_FOUND" as const,
        error: "You must add main village first",
      });
    return ok({ ok: true, message: "succeed" });
  });
