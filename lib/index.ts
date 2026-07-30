export const recipeA = {
  OPI: 16,
  VSC: 8,
  BCC: 4,
  "Hana Sticker": 1,
  Bottle: 1,
  Cap: 1,
  DPG: 3,
  ESA: 19,
  Box: 1,
};

export const RECIPE = {
  NPWGEISHA: {
    Geisha: 1,
    Box: 1,
    Pouch: 1,
    Bubble: 50,
  },
  NPWHANA: {
    Hana: 1,
    Box: 1,
    Pouch: 1,
    Bubble: 50,
  },
};

export const PRODUCTION_MATERIALS = {
  NPWGEISHA: {
    OPI: 16,
    VSC: 8,
    BCC: 4,
    DPG: 3,
    ESA: 19,
    "Geisha Sticker": 1,
    Bottle: 1,
    Cap: 1,
    Geisha: -1,
  },
  NPWHANA: {
    OPI: 18,
    VSC: 6,
    LUC: 6,
    DPG: 3,
    ESA: 17,
    "Hana Sticker": 1,
    Bottle: 1,
    Cap: 1,
    Hana: -1,
  },
};
// kalo typenya production product ++ yang lain -- kalo typenya sale semuanya --

export const INVENTORY_ITEMS = {
  DPG: 11,
  ESA: 12,
  VSC: 14,
  "Hana Sticker": 22,
  OPI: 13,
  BCC: 15,
  "Geisha Sticker": 21,
  Bottle: 23,
  Cap: 24,
  Box: 25,
  Geisha: 31,
  Hana: 32,
  Pouch: 26,
  Bubble: 27,
  LUC: 16,
};

export const ORDER_STATUS = [
  { value: "completed", styleColor: "green" },
  { value: "cancelled", styleColor: "red" },
  { value: "returned", styleColor: "yellow" },
];

export const ERROR_REGISTRY = {
  "products.get": {
    type: "DB_PRODUCTS_RETRIEVAL_ERROR",
    error: "We couldn't retrieve products",
  },
  "products.create": {
    type: "DB_PRODUCTS_CREATION_ERROR",
    error: "We couldn't create the product",
  },
  "products.delete": {
    type: "DB_PRODUCTS_DELETION_ERROR",
    error: "We couldn't delete the product",
  },
  "products.update": {
    type: "DB_PRODUCTS_UPDATE_ERROR",
    error: "We couldn't update the product",
  },

  "orders.get": {
    type: "DB_ORDER_RETRIEVAL_ERROR",
    error: "We couldn't retrieve the order",
  },
  "orders.create": {
    type: "DB_ORDER_CREATION_ERROR",
    error: "We couldn't create the order",
  },
  "orders.delete": {
    type: "DB_ORDER_DELETION_ERROR",
    error: "We couldn't delete this order",
  },
  "orders.update": {
    type: "DB_ORDER_UPDATE_ERROR",
    error: "We couldn't update the order",
  },

  "inventory.get": {
    type: "DB_INVENTORY_RETRIEVAL_ERROR",
    error: "We couldn't retrieve inventory",
  },
  "inventory.create": {
    type: "DB_INVENTORY_CREATION_ERROR",
    error: "We couldn't create inventory",
  },
  "inventory.delete": {
    type: "DB_INVENTORY_DELETION_ERROR",
    error: "We couldn't delete inventory",
  },
  "inventory.update": {
    type: "DB_INVENTORY_UPDATE_ERROR",
    error: "We couldn't update the inventory",
  },

  "inventoryTransactions.get": {
    type: "DB_INVENTORY_TRANSACTION_RETRIEVAL_ERROR",
    error: "We couldn't retrieve the inventory transaction",
  },
  "inventoryTransactions.create": {
    type: "DB_INVENTORY_TRANSACTION_CREATION_ERROR",
    error: "We couldn't create the inventory transaction",
  },
  "inventoryTransactions.delete": {
    type: "DB_INVENTORY_TRANSACTION_DELETION_ERROR",
    error: "We couldn't delete the inventory transaction",
  },
  "inventoryTransactions.update": {
    type: "DB_INVENTORY_TRANSACTION_UPDATE_ERROR",
    error: "We couldn't update the inventory transaction",
  },

  "customers.get": {
    type: "DB_CUSTOMER_RETRIEVAL_ERROR",
    error: "We couldn't retrieve the customer",
  },
  "customers.create": {
    type: "DB_CUSTOMER_CREATION_ERROR",
    error: "We couldn't create the customer",
  },
  "customers.delete": {
    type: "DB_CUSTOMER_DELETION_ERROR",
    error: "We couldn't delete the customer",
  },
  "customers.update": {
    type: "DB_CUSTOMER_UPDATE_ERROR",
    error: "We couldn't update the customer",
  },

  "orderItems.get": {
    type: "DB_ORDER_ITEMS_RETRIEVAL_ERROR",
    error: "We couldn't retrieve the order items",
  },
  "orderItems.create": {
    type: "DB_ORDER_ITEMS_CREATION_ERROR",
    error: "We couldn't create the order items",
  },
  "orderItems.delete": {
    type: "DB_ORDER_ITEMS_DELETION_ERROR",
    error: "We couldn't delete the order items",
  },
  "orderItems.update": {
    type: "DB_ORDER_ITEMS_UPDATE_ERROR",
    error: "We couldn't update the order items",
  },

  "shippings.get": {
    type: "DB_SHIPPING_RETRIEVAL_ERROR",
    error: "We couldn't retrieve the shipping info",
  },
  "shippings.create": {
    type: "DB_SHIPPING_CREATION_ERROR",
    error: "We couldn't create the shipping info",
  },
  "shippings.delete": {
    type: "DB_SHIPPING_DELETION_ERROR",
    error: "We couldn't delete the shipping info",
  },
  "shippings.update": {
    type: "DB_SHIPPING_UPDATE_ERROR",
    error: "We couldn't update the shipping info",
  },
} as const satisfies Record<string, { type: string; error: string }>;

export type ErrorRegistryKey = keyof typeof ERROR_REGISTRY;
