import {
  Product,
  OrderSummary,
  PlaceOrder,
  DatabaseActionReturnType,
  ReserveQuantity,
} from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const databaseApi = createApi({
  reducerPath: "databaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Products", "OrderSummary"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => `/v1/products`,
      providesTags: ["Products"],
      keepUnusedDataFor: 60 * 60,
    }),
    getOrders: builder.query<OrderSummary[], void>({
      query: () => "v1/order",
      providesTags: ["OrderSummary"],
      keepUnusedDataFor: 60 * 60,
    }),
    createOrder: builder.mutation<DatabaseActionReturnType, PlaceOrder>({
      query: (placeOrderForm) => ({
        url: "/v1/order",
        method: "POST",
        body: placeOrderForm,
      }),
      invalidatesTags: ["OrderSummary"],
    }),
    updateInventory: builder.mutation<
      DatabaseActionReturnType,
      ReserveQuantity
    >({
      query: (payload) => ({
        url: "v1/inventory",
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useUpdateInventoryMutation,
} = databaseApi;
