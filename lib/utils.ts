import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ERROR_REGISTRY, ErrorRegistryKey } from ".";
type DbAction = "get" | "create" | "delete" | "update";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class DatabaseError<T> extends Error {
  constructor(public readonly payload: T) {
    super(
      typeof payload === "object" && payload !== null && "type" in payload
        ? String((payload as { type: unknown }).type)
        : "DatabaseError",
    );
  }
}

const parseDatabaseError = (e: unknown): string | undefined => {
  if (
    typeof e === "object" &&
    e !== null &&
    "cause" in e &&
    typeof e.cause === "object" &&
    e.cause !== null &&
    "table" in e.cause
  ) {
    return String((e.cause as { table: unknown }).table);
  }
  return undefined;
};

const parseDatabaseAction = (query: string): DbAction | undefined => {
  const firstWord = query.trim().split(/\s+/)[0]?.toUpperCase();

  switch (firstWord) {
    case "SELECT":
      return "get";
    case "INSERT":
      return "create";
    case "UPDATE":
      return "update";
    case "DELETE":
      return "delete";
    default:
      return undefined;
  }
};

const parseDatabaseCause = (
  e: unknown,
): { table: string; action: DbAction } | undefined => {
  if (
    typeof e !== "object" ||
    e === null ||
    !("cause" in e) ||
    typeof e.cause !== "object" ||
    e.cause === null ||
    !("table" in e.cause)
  ) {
    return undefined;
  }

  const table = String((e.cause as { table: unknown }).table);

  if (!("query" in e) || typeof e.query !== "string") {
    return undefined;
  }

  const action = parseDatabaseAction(e.query);
  if (!action) return undefined;

  return { table, action };
};

export function databaseErrorMapper<T extends { type: string; error: string }>(
  e: unknown,
  tableMap: Record<string, T>,
): T {
  if (e instanceof DatabaseError) return e.payload as T;

  const table = parseDatabaseError(e);
  const mapped = table ? tableMap[table] : undefined;
  return (
    mapped ??
    ({
      type: "DATABASE_ERROR",
      error: "Unexpected error",
    } as T)
  );
}

export function mapDatabaseError<
  T extends { type: string; error: string } = { type: string; error: string },
>(e: unknown): T {
  if (e instanceof DatabaseError) return e.payload as T;

  const cause = parseDatabaseCause(e);
  console.log("parsed db error:", cause);
  const key = cause ? `${cause.table}.${cause.action}` : undefined;
  const mapped =
    key && key in ERROR_REGISTRY
      ? ERROR_REGISTRY[key as ErrorRegistryKey]
      : undefined;

  return (
    (mapped as T) ??
    ({ type: "DATABASE_ERROR", error: "Unexpected error" } as T)
  );
}
