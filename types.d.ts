import * as validation from "@/lib/validation";
import { z } from "zod";
import {
  inventoryTransactions,
  orderStatusEnum,
  shipmentStatusEnum,
  userTypeEnum,
} from "./db/schema";
import { InferEnum, InferInsertModel } from "drizzle-orm";

export type UserType = InferEnum<typeof userTypeEnum>;

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

export type Inventory = z.infer<typeof validation.selectInventorySchema>;

export type InventoryTransactions = InferInsertModel<
  typeof inventoryTransactions
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
  shipmentId?: string;
  shipmentDetails?: string;
  shipmentStatus: shipmentStatus;
};

export type Revenue = {
  revenue: number;
};

export type DashboardData = {
  monthlyRevenue: {
    value: number;
    link: string;
  };
  todayOrders: {
    value: number;
    link: string;
  };
  pendingOrders: {
    value: number;
    link: string;
  };
  pendingShipments: {
    value: number;
    link: string;
  };
};

export interface AuthCredentials {
  username: string;
  password: string;
}
