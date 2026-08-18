import {
  serial,
  pgEnum,
  varchar,
  integer,
  timestamp,
  snakeCase,
  uuid,
  numeric,
  text,
} from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum("user_type", [
  "level_0",
  "level_1",
  "level_2",
  "level_3",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "completed",
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
  "low_on_stock",
]);

export const shipmentStatusEnum = pgEnum("shipment_status", [
  "pending",
  "packed",
  "delivered",
  "lost",
  "returned",
  "cancelled",
  "on_delivery",
  "failed_delivery",
]);

export const inventoryTransactionReasonEnum = pgEnum(
  "inventory_transaction_reason",
  ["purchase", "sale", "production", "adjustment", "damaged", "lost"],
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
  lowStockThreshold: integer("low_stock_threshold").notNull().default(10),
});

export const inventoryTransactions = snakeCase.table("inventory_transactions", {
  inventoryTransactionId: serial().primaryKey(),
  itemId: integer()
    .notNull()
    .references(() => inventoryItems.itemId),
  changeQuantity: integer().notNull(),
  reason: inventoryTransactionReasonEnum().notNull(),
  referenceId: uuid(),
  createdAt: timestamp().defaultNow(),
});

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

export const shipments = snakeCase.table("shipments", {
  orderId: uuid()
    .primaryKey()
    .references(() => orders.orderId, { onDelete: "cascade" }),
  shipmentId: varchar().notNull().default("No Data"),
  shipmentStatus: shipmentStatusEnum("shipment_status").notNull(),
  shipmentDetails: text().notNull().default("No Details"),
});

export const users = snakeCase.table("users", {
  userId: uuid().primaryKey().defaultRandom(),
  username: varchar().notNull().unique(),
  email: varchar("email").notNull().default("test@mail.com"),
  password: varchar().default("").notNull(),
  userType: userTypeEnum("user_type").notNull().default("level_3"),
});
