import {
  serial,
  pgEnum,
  varchar,
  integer,
  timestamp,
  snakeCase,
  uuid,
  numeric,
} from "drizzle-orm/pg-core";

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
  itemId: integer().primaryKey(),
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
  price: integer().notNull(),
});

export const inventory = snakeCase.table("inventory", {
  itemId: integer()
    .primaryKey()
    .references(() => inventoryItems.itemId),
  quantityOnHand: numeric("quantity_on_hand", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  quantityReserved: numeric("quantity_reserved", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  status: stockStatusEnum().notNull().default("in_stock"),
});

export const inventoryTransactions = snakeCase.table("inventory_transactions", {
  transactionId: serial().primaryKey(),
  itemId: integer()
    .notNull()
    .references(() => inventoryItems.itemId),
  changeQuantity: integer().notNull(),
  reason: inventoryTransactionReasonEnum().notNull(),
  referenceId: uuid(),
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
  orderId: uuid().primaryKey().defaultRandom(),
  invoice: varchar().notNull().unique(),
  customerId: uuid()
    .references(() => customers.customerId)
    .notNull(),
  status: orderStatusEnum().default("pending").notNull(),
  grandTotal: integer().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const orderItems = snakeCase.table("order_items", {
  orderItemId: uuid().primaryKey().notNull().defaultRandom(),
  orderId: uuid()
    .notNull()
    .references(() => orders.orderId, { onDelete: "cascade" }),
  sku: varchar()
    .notNull()
    .references(() => products.sku),
  quantity: integer().notNull(),
  unitPrice: integer().notNull(),
  lineTotal: integer().notNull(),
});

export const customers = snakeCase.table("customers", {
  customerId: uuid().primaryKey().notNull().defaultRandom(),
  customerName: varchar({ length: 150 }).notNull(),
});
