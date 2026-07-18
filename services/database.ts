import { Product, OrderSummary, PlaceOrder } from "@/types";
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
    createOrder: builder.mutation<
      { success: boolean; message: string },
      PlaceOrder
    >({
      query: (placeOrderForm) => ({
        url: "/v1/order",
        method: "POST",
        body: placeOrderForm,
      }),
    }),
  }),
});

export const { useGetProductsQuery, useGetOrdersQuery } = databaseApi;
