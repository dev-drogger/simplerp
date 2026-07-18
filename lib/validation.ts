import * as schema from "@/db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";
import { z } from "zod";

export const inputOrderSchema = z.object({
  invoice: z.string().startsWith("INV"),
  customerName: z.string(),
  status: z.enum(["completed", "shipped", "cancelled", "returned", "pending"]),
  items: z
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
            message: "Quantity must be greater than 0",
            path: [index, "quantity"],
          });
        }

        // Check duplicate SKU
        if (skuSet.has(item.sku)) {
          ctx.addIssue({
            code: "custom",
            message: "SKU must be unique",
            path: [index, "sku"],
          });
        }

        skuSet.add(item.sku);
      });
    }),
});

export const selectInventorySchema = createSelectSchema(schema.inventory);
export const insertInventorySchema = createInsertSchema(schema.inventory);
export const updateInventorySchema = createUpdateSchema(schema.inventory);

export const selectInventoryTransactionSchema = createSelectSchema(
  schema.inventoryTransactions,
);
export const insertInventoryTransactionSchema = createInsertSchema(
  schema.inventoryTransactions,
);
export const updateInventoryTransactionSchema = createUpdateSchema(
  schema.inventoryTransactions,
);

export const selectOrderItemsSchema = createSelectSchema(schema.orderItems);
export const insertOrderItemsSchema = createInsertSchema(schema.orderItems);
export const updateOrderItemsSchema = createUpdateSchema(schema.orderItems);

export const selectOrdersSchema = createSelectSchema(schema.orders);
export const insertOrdersSchema = createInsertSchema(schema.orders);
export const updateOrdersSchema = createUpdateSchema(schema.orders);

export const selectCustomerSchema = createSelectSchema(schema.customers);
export const insertCustomerSchema = createInsertSchema(schema.customers);
export const updateCustomerSchema = createUpdateSchema(schema.customers);

export const selectProductsSchema = createSelectSchema(schema.products);
export const insertProductsSchema = createInsertSchema(schema.products);
export const updateProductsSchema = createUpdateSchema(schema.products);

export const placeOrderSchema = z.object({
  order: insertOrdersSchema,
  items: z.array(insertOrderItemsSchema),
  customer: insertCustomerSchema,
});
