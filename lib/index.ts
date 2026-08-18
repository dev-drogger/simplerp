export const RECIPE = {
  NPWGEISHA: {
    "Perfume - Variant A": 1,
    Box: 1,
    Pouch: 1,
    "Bubble Wrap": 50,
  },
  NPWHANA: {
    "Perfume - Variant B": 1,
    Box: 1,
    Pouch: 1,
    "Bubble Wrap": 50,
  },
};

export const PRODUCTION_MATERIALS = {
  NPWGEISHA: {
    "Chemical C": 16,
    "Chemical D": 8,
    "Chemical E": 4,
    "Chemical A": 3,
    "Chemical B": 19,
    "Product Sticker": 1,
    Bottle: 1,
    "Cap and Sprayer": 1,
    "Perfume - Variant A": -1,
  },
  NPWHANA: {
    "Chemical C": 18,
    "Chemical D": 6,
    "Chemical F": 6,
    "Chemical A": 3,
    "Chemical B": 17,
    "Product Sticker": 1,
    Bottle: 1,
    "Cap and Sprayer": 1,
    "Perfume - Variant B": -1,
  },
};
// kalo typenya production product ++ yang lain -- kalo typenya sale semuanya --

export const INVENTORY_ITEMS = {
  "Chemical A": 11,
  "Chemical B": 12,
  "Chemical D": 14,
  "Chemical C": 13,
  "Chemical E": 15,
  "Product Sticker": 21,
  Bottle: 23,
  "Cap and Sprayer": 24,
  Box: 25,
  "Perfume - Variant A": 31,
  "Perfume - Variant B": 32,
  Pouch: 26,
  "Bubble Wrap": 27,
  "Chemical F": 16,
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

export const AUTH_FORM_FIELD = {
  SIGN_IN: {
    names: {
      username: "Username",
      email: "email",
      password: "Password",
    },
    types: {
      username: "text",
      email: "email",
      password: "password",
    },
    placeholders: {
      username: "Enter your username",
      email: "Enter your email",
      password: "Enter your password",
    },
  },
};

export const PUBLIC_ROUTES = [
  "/",
  "/rate-limit",
  "/sitemap.xml",
  "/robots.txt",
];

export const AUTH_ROUTES = "/sign-in";
export const API_ROUTES = "/api";
export const AUTH_API_ROUTES = "/api/auth";
