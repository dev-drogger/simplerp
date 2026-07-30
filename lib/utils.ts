import { type Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ERROR_REGISTRY,
  ErrorRegistryKey,
  INVENTORY_ITEMS,
  PRODUCTION_MATERIALS,
  RECIPE,
} from ".";
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

export function mapDatabaseError<
  T extends { type: string; error: string } = { type: string; error: string },
>(e: unknown): T {
  if (e instanceof DatabaseError) return e.payload as T;

  const cause = parseDatabaseCause(e);
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

const calculateStock = <T extends { sku: string; quantity: number }>(
  items: T[],
  release: boolean,
  production: boolean,
) => {
  const totals = items.reduce<Record<string, number>>((acc, item) => {
    const recipe = production
      ? PRODUCTION_MATERIALS[item.sku as keyof typeof RECIPE]
      : RECIPE[item.sku as keyof typeof RECIPE];
    Object.entries(recipe).forEach(([material, amountPerUnit]) => {
      acc[material] = (acc[material] ?? 0) + amountPerUnit * item.quantity;
    });
    return acc;
  }, {});

  return Object.entries(totals).map(([material, amount]) => ({
    itemId: Number(INVENTORY_ITEMS[material as keyof typeof INVENTORY_ITEMS]),
    amount: release ? -amount : amount,
  }));
};

export const reserveQuantity = <T extends { sku: string; quantity: number }>(
  inventoryItems: T[],
) => calculateStock(inventoryItems, false, false);

export const releaseQuantity = <T extends { sku: string; quantity: number }>(
  inventoryItems: T[],
) => calculateStock(inventoryItems, true, false);

export const calculateMaterialUsage = <
  T extends { sku: string; quantity: number },
>(
  inventoryItems: T[],
) => calculateStock(inventoryItems, true, true);

export const dateFilterFn = <TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: Date,
): boolean => {
  if (!filterValue) return true;
  const cellValue = row.getValue(columnId) as string; // "2026-07-28 11:44:42.424165"
  if (!cellValue) return false;

  const cellDateStr = cellValue.slice(0, 10); // "2026-07-28"
  const filterDateStr = format(filterValue, "yyyy-MM-dd");

  return cellDateStr === filterDateStr;
};
