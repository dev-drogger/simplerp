import * as validation from "@/lib/validation";
import { z } from "zod";
import { orderStatusEnum, shipmentStatusEnum } from "./db/schema";
import { InferEnum } from "drizzle-orm";

type OrderSummary = {
  orderId: string;
  date: Date;
  invoice: string;
  customerName: string;
  items: {
    productName: string;
    sku: string;
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
  | "on_process"
  | "cancelled"
  | "returned"
  | "pending";

export type Inventory = z.infer<typeof validation.selectInventorySchema>;

export type InventoryTransaction = z.infer<
  typeof validation.inventoryTransactionSchema
>;

export type OrderItems = z.infer<typeof validation.selectOrderItemsSchema>;
export type Order = z.infer<typeof validation.selectOrdersSchema>;
export type Customer = z.infer<typeof validation.selectCustomerSchema>;
export type Product = z.infer<typeof validation.selectProductsSchema>;
export type InputOrder = z.infer<typeof validation.inputOrderSchema>;
export type PlaceOrder = z.infer<typeof validation.placeOrderSchema>;

export type OrderStatus = InferEnum<typeof orderStatusEnum>;

export type DatabaseActionReturnType = { ok: boolean; message: string };
export type InventoryActions = "restock" | "adjustment" | "add" | "production";

export type StockAmount = {
  itemId: number;
  amount: number;
}[];

export type ShipmentSummary = {
  date: Date;
  orderId: string;
  invoice: string;
  orderDetails: {
    productName: string;
    sku: string;
    quantity: number;
  }[];
  shipmentId: string;
  shipmentStatus: shipmentStatus;
  shipmentDetails: string;
};

export type shipmentStatus = InferEnum<typeof shipmentStatusEnum>;

export type ShipmentInformation = {
  orderId: string;
  shipmentId: string;
  shipmentDetails: string;
  shipmentStatus: shipmentStatus;
};
