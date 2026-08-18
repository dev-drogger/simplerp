type DbError<TType extends string> = {
  type: TType | "DATABASE_ERROR";
  error: string;
};

export type GetProductsError = DbError<"DB_PRODUCTS_RETRIEVAL_ERROR">;
export type GetOrderError = DbError<"DB_ORDER_RETRIEVAL_ERROR">;
export type GetInventoryError = DbError<"DB_INVENTORY_RETRIEVAL_ERROR">;
export type GetInventoryTransactionError =
  DbError<"DB_INVENTORY_TRANSACTION_RETRIEVAL_ERROR">;
export type GetCustomerError = DbError<"DB_CUSTOMER_RETRIEVAL_ERROR">;
export type GetOrderItemsError = DbError<"DB_ORDER_ITEMS_RETRIEVAL_ERROR">;
export type GetShipmentsError = DbError<"DB_SHIPMENTS_RETRIEVAL_ERROR">;

export type CreateProductsError = DbError<"DB_PRODUCTS_CREATION_ERROR">;
export type CreateOrderError = DbError<"DB_ORDER_CREATION_ERROR">;
export type CreateInventoryError = DbError<"DB_INVENTORY_CREATION_ERROR">;
export type CreateInventoryTransactionError =
  DbError<"DB_INVENTORY_TRANSACTION_CREATION_ERROR">;
export type CreateCustomerError = DbError<"DB_CUSTOMER_CREATION_ERROR">;
export type CreateOrderItemsError = DbError<"DB_ORDER_ITEMS_CREATION_ERROR">;
export type CreateShipmentsError = DbError<"DB_SHIPMENTS_CREATION_ERROR">;

export type DeleteProductsError = DbError<"DB_PRODUCTS_DELETION_ERROR">;
export type DeleteOrderError = DbError<"DB_ORDER_DELETION_ERROR">;
export type DeleteInventoryError = DbError<"DB_INVENTORY_DELETION_ERROR">;
export type DeleteInventoryTransactionError =
  DbError<"DB_INVENTORY_TRANSACTION_DELETION_ERROR">;
export type DeleteCustomerError = DbError<"DB_CUSTOMER_DELETION_ERROR">;
export type DeleteOrderItemsError = DbError<"DB_ORDER_ITEMS_DELETION_ERROR">;
export type DeleteShipmentsError = DbError<"DB_SHIPMENTS_DELETION_ERROR">;

export type UpdateProductsError = DbError<"DB_PRODUCTS_UPDATE_ERROR">;
export type UpdateOrderError = DbError<"DB_ORDER_UPDATE_ERROR">;
export type UpdateInventoryError = DbError<"DB_INVENTORY_UPDATE_ERROR">;
export type UpdateInventoryTransactionError =
  DbError<"DB_INVENTORY_TRANSACTION_UPDATE_ERROR">;
export type UpdateCustomerError = DbError<"DB_CUSTOMER_UPDATE_ERROR">;
export type UpdateOrderItemsError = DbError<"DB_ORDER_ITEMS_UPDATE_ERROR">;
export type UpdateShipmentsError = DbError<"DB_SHIPMENTS_UPDATE_ERROR">;

export type PlaceOrderError =
  | CreateOrderItemsError
  | CreateCustomerError
  | CreateOrderError
  | UpdateInventoryError
  | QuantityExceedError
  | GetInventoryError;

export type QuantityExceedError = {
  type: "QUANTITY_RESERVED_EXCEED" | "DATABASE_ERROR";
  error: string;
};

export type DeletePlacedOrderError = DeleteOrderError | UpdateInventoryError;
export type AppError<T> = AccessError | T;
export type StockError =
  | GetInventoryError
  | QuantityExceedError
  | UpdateInventoryError
  | OnHandError;

export type OnHandError = DbError<"INSUFFICIENT_ON_HAND_QUANTITY">;

export type GetRevenueError = DbError<"DB_REVENUE_RETRIEVAL_ERROR">;
