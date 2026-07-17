export type GetProductsError = {
  type: "DB_PRODUCTS_RETRIEVAL_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type CreateProductsError = {
  type: "DB_PRODUCTS_CREATION_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type UpdateProductsError = {
  type: "DB_PRODUCTS_UPDATE_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type DeleteProductsError = {
  type: "DB_PRODUCTS_DELETION_ERROR" | "DATABASE_ERROR";
  error: string;
};

export type GetOrdersError = {
  type: "DB_ORDERS_RETRIEVAL_ERROR" | "DATABASE_ERROR";
  error: string;
};

export type CreateOrdersError = {
  type: "DB_ORDERS_CREATION_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type UpdateOrdersError = {
  type: "DB_ORDERS_UPDATE_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type DeleteOrdersError = {
  type: "DB_ORDERS_DELETION_ERROR" | "DATABASE_ERROR";
  error: string;
};

export type GetInventoryError = {
  type: "DB_INVENTORY_RETRIEVAL_ERROR" | "DATABASE_ERROR";
  error: string;
};

export type CreateInventoryError = {
  type: "DB_INVENTORY_CREATION_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type UpdateInventoryError = {
  type: "DB_INVENTORY_UPDATE_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type DeleteInventoryError = {
  type: "DB_INVENTORY_DELETION_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type GetInventoryTransactionError = {
  type: "DB_INVENTORY_TRANSACTION_RETRIEVAL_ERROR" | "DATABASE_ERROR";
  error: string;
};

export type CreateInventoryTransactionError = {
  type: "DB_INVENTORY_TRANSACTION_CREATION_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type UpdateInventoryTransactionError = {
  type: "DB_INVENTORY_TRANSACTION_UPDATE_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type DeleteInventoryTransactionError = {
  type: "DB_INVENTORY_TRANSACTION_DELETION_ERROR" | "DATABASE_ERROR";
  error: string;
};

export type GetCustomerError = {
  type: "DB_CUSTOMER_RETRIEVAL_ERROR" | "DATABASE_ERROR";
  error: string;
};

export type CreateCustomerError = {
  type: "DB_CUSTOMER_CREATION_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type UpdateCustomerError = {
  type: "DB_CUSTOMER_UPDATE_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type DeleteCustomerError = {
  type: "DB_CUSTOMER_DELETION_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type GetOrderItemsError = {
  type: "DB_ORDER_ITEMS_RETRIEVAL_ERROR" | "DATABASE_ERROR";
  error: string;
};

export type CreateOrderItemsError = {
  type: "DB_ORDER_ITEMS_CREATION_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type UpdateOrderItemsError = {
  type: "DB_ORDER_ITEMS_UPDATE_ERROR" | "DATABASE_ERROR";
  error: string;
};
export type DeleteOrderItemsError = {
  type: "DB_ORDER_ITEMS_DELETION_ERROR" | "DATABASE_ERROR";
  error: string;
};
