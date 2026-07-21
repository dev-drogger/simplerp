import { PlaceOrderError } from "@/types.error";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TABLE_TO_ERROR: Record<string, PlaceOrderError> = {
  customers: {
    type: "DB_CUSTOMER_CREATION_ERROR",
    error: "We couldn't add this customer",
  },
  orders: {
    type: "DB_ORDER_CREATION_ERROR",
    error: "We couldn't add this order",
  },
  order_items: {
    type: "DB_ORDER_ITEMS_CREATION_ERROR",
    error: "We couldn't add the order items",
  },
};

export const parseDatabaseError = (e: unknown): string | undefined => {
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

export const mapDatabaseError = (e: unknown): PlaceOrderError => {
  const table = parseDatabaseError(e);
  const mapped = table ? TABLE_TO_ERROR[table] : undefined;
  return (
    mapped ?? {
      type: "DATABASE_ERROR",
      error: "Unexpected error",
    }
  );
};
