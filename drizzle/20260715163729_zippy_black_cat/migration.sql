CREATE TYPE "inventory_transaction_reason" AS ENUM('purchase', 'sale', 'production', 'return', 'adjustment', 'damage');--> statement-breakpoint
CREATE TYPE "item_type" AS ENUM('finished_good', 'raw_material', 'packaging');--> statement-breakpoint
CREATE TYPE "order_status" AS ENUM('completed', 'shipped', 'cancelled', 'returned', 'pending');--> statement-breakpoint
CREATE TYPE "stock_status" AS ENUM('in_stock', 'out_of_stock', 'discontinued');--> statement-breakpoint
CREATE TABLE "customers" (
	"customer_id" serial PRIMARY KEY,
	"name" varchar(150) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"item_id" integer PRIMARY KEY,
	"quantity_on_hand" integer DEFAULT 0 NOT NULL,
	"quantity_reserved" integer DEFAULT 0 NOT NULL,
	"status" "stock_status" DEFAULT 'in_stock'::"stock_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"item_id" serial PRIMARY KEY,
	"name" varchar(150) NOT NULL,
	"type" "item_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_transactions" (
	"transaction_id" integer PRIMARY KEY,
	"item_id" integer NOT NULL,
	"change_quantity" integer NOT NULL,
	"reason" "inventory_transaction_reason" NOT NULL,
	"reference_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"order_item_id" serial PRIMARY KEY,
	"order_id" integer NOT NULL,
	"sku" varchar NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10,2) NOT NULL,
	"line_total" numeric(10,2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"order_id" serial PRIMARY KEY,
	"invoice" varchar NOT NULL UNIQUE,
	"customer_id" integer,
	"status" "order_status" DEFAULT 'pending'::"order_status",
	"grand_total" numeric(10,2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"category_id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"product_id" serial PRIMARY KEY,
	"category_id" integer NOT NULL,
	"item_id" integer NOT NULL UNIQUE,
	"product_name" varchar NOT NULL,
	"sku" varchar NOT NULL UNIQUE,
	"price" numeric NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_item_id_inventory_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("item_id");--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_item_id_inventory_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("item_id");--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_sku_products_sku_fkey" FOREIGN KEY ("sku") REFERENCES "products"("sku");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("category_id");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_item_id_inventory_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("item_id");