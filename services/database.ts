import { Product, OrderReturnType } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const databaseApi = createApi({
  reducerPath: "databaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Products", "Orders"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => `/v1/products`,
      providesTags: ["Products"],
      keepUnusedDataFor: 60 * 60,
    }),
    getOrders: builder.query<OrderReturnType[], void>({
      query: () => "v1/orders",
      providesTags: ["Products"],
      keepUnusedDataFor: 60 * 60,
    }),
  }),
});

export const { useGetProductsQuery, useGetOrdersQuery } = databaseApi;
