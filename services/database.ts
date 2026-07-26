import {
  Product,
  OrderSummary,
  PlaceOrder,
  DatabaseActionReturnType,
  ReserveQuantity,
  OrderStatus,
  InventorySummary,
} from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const databaseApi = createApi({
  reducerPath: "databaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Products", "OrderSummary", "Inventory"],
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
    getInventory: builder.query<InventorySummary[], void>({
      query: () => "v1/inventory",
      providesTags: ["Inventory"],
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
    deleteOrder: builder.mutation<
      DatabaseActionReturnType,
      { orderId: string; materials: ReserveQuantity }
    >({
      query: (payload) => ({
        url: "/v1/order",
        method: "delete",
        body: payload,
      }),
      invalidatesTags: ["OrderSummary"],
    }),
    restockInventory: builder.mutation<
      DatabaseActionReturnType,
      { items: ReserveQuantity }
    >({
      query: (payload) => ({
        url: "v1/inventory",
        method: "PUT",
        body: payload,
      }),
    }),
    updateOrderStatus: builder.mutation<
      DatabaseActionReturnType,
      { orderId: string; status: OrderStatus; materials: ReserveQuantity }
    >({
      query: (payload) => ({
        url: "v1/order",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["OrderSummary"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetOrdersQuery,
  useGetInventoryQuery,
  useCreateOrderMutation,
  useRestockInventoryMutation,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation,
} = databaseApi;
