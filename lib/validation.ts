import * as schema from "@/db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";
import { z } from "zod";

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

export const ordersSchema = z.object({
  order: insertOrdersSchema,
  items: z.array(insertOrderItemsSchema),
  customer: insertCustomerSchema,
});
