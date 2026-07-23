import * as validation from "@/lib/validation";
import { z } from "zod";
import { itemTypeEnum, stockStatusEnum } from "./db/schema";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
];

type PaymentStatus = "pending" | "processing" | "success" | "failed";

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

export type DatabaseActionReturnType = { ok: boolean; message: string };
