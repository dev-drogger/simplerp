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
