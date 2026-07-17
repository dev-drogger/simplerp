import * as schema from "@/db/schema";
import * as validation from "@/lib/validation";
import { z } from "zod";

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

type OrderReturnType = {
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
export type Orders = z.infer<typeof validation.selectOrdersSchema>;
export type Customer = z.infer<typeof validation.selectCustomerSchema>;
export type Product = z.infer<typeof validation.selectProductsSchema>;
