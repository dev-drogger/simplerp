import * as schema from "@/db/schema";
import { createSelectSchema } from "drizzle-orm/zod";
import { z } from "zod";

export const selectInventorySchema = createSelectSchema(schema.inventory);

export const selectInventoryTransactionSchema = createSelectSchema(
  schema.inventoryTransactions,
);

export const selectOrderItemsSchema = createSelectSchema(schema.orderItems);

export const selectOrdersSchema = createSelectSchema(schema.orders);

export const selectCustomerSchema = createSelectSchema(schema.customers);

export const selectProductsSchema = createSelectSchema(schema.products);

export const stockAmountSchema = z.object({
  stockAmount: z.array(
    z.object({
      itemId: z.number(),
      amount: z.number(),
    }),
  ),
});

export const inputOrderSchema = z.object({
  invoice: z.string().startsWith("INV", "Invoice should starts with 'INV'"),
  customerName: z.string(),
  products: z
    .array(
      z.object({
        sku: z.string(),
        quantity: z.number(),
      }),
    )
    .superRefine((items, ctx) => {
      const skuSet = new Set<string>();

      items.forEach((item, index) => {
        if (item.quantity <= 0) {
          ctx.addIssue({
            code: "custom",
            message: "Minimum quantity is 1",
            path: [index, "quantity"],
          });
        }

        if (skuSet.has(item.sku)) {
          ctx.addIssue({
            code: "custom",
            message: "SKU must be unique",
            path: [index, "sku"],
          });
        }
        if (item.sku == "") {
          ctx.addIssue({
            code: "custom",
            message: "Please select a product",
            path: [index, "sku"],
          });
        }

        skuSet.add(item.sku);
      });
    }),
});

export const placeOrderSchema = z
  .object({
    order: createSelectSchema(schema.orders, {
      createdAt: z.date().optional(),
    }),
    orderItems: z.array(
      createSelectSchema(schema.orderItems, {
        orderItemId: z.string().optional(),
      }),
    ),
    customer: selectCustomerSchema,
  })
  .and(stockAmountSchema);

export const productsSchema = z.object({
  products: z
    .array(
      z.object({
        sku: z.string(),
        quantity: z.number(),
      }),
    )
    .superRefine((items, ctx) => {
      const skuSet = new Set<string>();

      items.forEach((item, index) => {
        // Check quantity
        if (item.quantity <= 0) {
          ctx.addIssue({
            code: "custom",
            message: "Minimum quantity is 1",
            path: [index, "quantity"],
          });
        }

        if (skuSet.has(item.sku)) {
          ctx.addIssue({
            code: "custom",
            message: "SKU must be unique",
            path: [index, "sku"],
          });
        }
        if (item.sku == "") {
          ctx.addIssue({
            code: "custom",
            message: "Please select a product",
            path: [index, "sku"],
          });
        }

        skuSet.add(item.sku);
      });
    }),
});

export const inventoryTransactionSchema = z.object({
  inventoryTransactions: z.array(
    z.object({
      itemId: z.number(),
      changeQuantity: z.number(),
      reason: z.enum([
        "purchase",
        "sale",
        "production",
        "adjustment",
        "damaged",
        "lost",
      ]),
      referenceId: z.string().optional(),
    }),
  ),
});

export const updateShipmentSchema = z.object({
  orderId: z.string(),
  shipmentId: z.string(),
  shipmentDetails: z.string(),
  shipmentStatus: z.enum([
    "pending",
    "packed",
    "delivered",
    "lost",
    "returned",
    "cancelled",
    "on_delivery",
    "failed_delivery",
  ]),
});

export const signInSchema = z.object({
  username: z
    .string()
    .min(5, "Username must contains at least 5 characters")
    .max(20),
  password: z.string(),
  // .min(8, "Password must contains at least 8 characters and one number")
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number"),
});
