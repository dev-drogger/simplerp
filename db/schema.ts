import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import {
  serial,
  pgEnum,
  varchar,
  integer,
  numeric,
  timestamp,
  snakeCase,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const orderStatusEnum = pgEnum("order_status", [
  "completed",
  "shipped",
  "cancelled",
  "returned",
  "pending",
]);

export const itemTypeEnum = pgEnum("item_type", [
  "finished_good",
  "raw_material",
  "packaging",
]);

export const stockStatusEnum = pgEnum("stock_status", [
  "in_stock",
  "out_of_stock",
  "discontinued",
]);

export const inventoryTransactionReasonEnum = pgEnum(
  "inventory_transaction_reason",
  ["purchase", "sale", "production", "return", "adjustment", "damage"],
);

export const inventoryItems = snakeCase.table("inventory_items", {
  itemId: integer("item_id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  type: itemTypeEnum("type").notNull(),
});

export const productCategories = snakeCase.table("product_categories", {
  categoryId: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
});

export const products = snakeCase.table("products", {
  productId: serial().primaryKey(),
  categoryId: integer()
    .notNull()
    .references(() => productCategories.categoryId),
  itemId: integer()
    .notNull()
    .unique()
    .references(() => inventoryItems.itemId),
  productName: varchar().notNull(),
  sku: varchar().notNull().unique(),
  price: numeric().notNull(),
});

export const inventory = snakeCase.table("inventory", {
  itemId: integer()
    .primaryKey()
    .references(() => inventoryItems.itemId),
  quantityOnHand: integer().notNull().default(0),
  quantityReserved: integer().notNull().default(0),
  status: stockStatusEnum().notNull().default("in_stock"),
});

export const inventoryTransactions = snakeCase.table("inventory_transactions", {
  transactionId: serial().primaryKey(),
  itemId: integer()
    .notNull()
    .references(() => inventoryItems.itemId),
  changeQuantity: integer().notNull(),
  reason: inventoryTransactionReasonEnum().notNull(),
  referenceId: integer(),
  createdAt: timestamp().defaultNow(),
});

// export const billOfMaterials = snakeCase.table("bill_of_materials", {
//   bomId: serial("bom_id").primaryKey(),
//   productId: integer("variant_id")
//     .notNull()
//     .references(() => products.productId),
//   componentItemId: integer("component_item_id")
//     .notNull()
//     .references(() => inventoryItems.itemId),
//   quantityRequired: integer("quantity_required").notNull(),
// });

export const orders = snakeCase.table("orders", {
  orderId: serial().primaryKey(),
  invoice: varchar().notNull().unique(),
  customerId: integer().references(() => customers.customerId),
  status: orderStatusEnum().default("pending"),
  grandTotal: numeric({ precision: 10, scale: 2 }),
  createdAt: timestamp().defaultNow(),
});

export const orderItems = snakeCase.table("order_items", {
  orderItemId: serial().primaryKey(),
  orderId: integer()
    .notNull()
    .references(() => orders.orderId, { onDelete: "cascade" }),
  sku: varchar()
    .notNull()
    .references(() => products.sku),
  quantity: integer().notNull(),
  unitPrice: numeric({ precision: 10, scale: 2 }).notNull(),
  lineTotal: numeric({ precision: 10, scale: 2 }).notNull(),
});

export const customers = snakeCase.table("customers", {
  customerId: serial().primaryKey(),
  name: varchar({ length: 150 }).notNull(),
});

export const insertOrdersSchema = createInsertSchema(orders);
export const insertCustomerSchema = createInsertSchema(customers);
export const insertOrderItemsSchema = createInsertSchema(orderItems);
export const ordersSchema = z.object({
  order: insertOrdersSchema,
  items: z.array(insertOrderItemsSchema),
  customer: insertCustomerSchema,
});
export const createProductsSchema = createSelectSchema(products);
export type Products = z.infer<typeof createProductsSchema>;
