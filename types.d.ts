import * as validation from "@/lib/validation";
import { z } from "zod";
import { itemTypeEnum, stockStatusEnum, orderStatusEnum } from "./db/schema";
import { InferEnum } from "drizzle-orm";

type OrderSummary = {
  orderId: string;
  date: Date;
  invoice: string;
  customerName: string;
  items: {
    productName: string;
    quantity: number;
  }[];
  status: SaleStatus;
  amount: number;
};

type InventorySummary = {
  itemId: number;
  name: string;
  quantityOnHand: string;
  quantityReserved: string;
  type: ItemType;
  status: StockStatus;
};

type SaleStatus =
  | "completed"
  | "shipped"
  | "cancelled"
  | "returned"
  | "pending";

export type Inventory = z.infer<typeof validation.selectInventorySchema>;

export type InventoryTransaction = z.infer<
  typeof validation.selectInventoryTransactionSchema
>;

export type OrderItems = z.infer<typeof validation.selectOrderItemsSchema>;
export type Order = z.infer<typeof validation.selectOrdersSchema>;
export type Customer = z.infer<typeof validation.selectCustomerSchema>;
export type Product = z.infer<typeof validation.selectProductsSchema>;
export type InputOrder = z.infer<typeof validation.inputOrderSchema>;
export type PlaceOrder = z.infer<typeof validation.placeOrderSchema>;
export type ItemType = z.infer<typeof itemTypeEnum>;
export type StockStatus = z.infer<typeof stockStatusEnum>;

export type ReserveQuantity = {
  itemId: number;
  amount: number;
}[];

export type OrderStatus = InferEnum<typeof orderStatusEnum>;

export type DatabaseActionReturnType = { ok: boolean; message: string };
export type InventoryActions = "restock" | "adjustmen" | "add" | "production";

export type StockAdjustment = {
  itemId: number;
  amount: number;
}[];
