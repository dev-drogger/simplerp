import {
  Product,
  OrderSummary,
  PlaceOrder,
  DatabaseActionReturnType,
  StockAmount,
  OrderStatus,
  InventorySummary,
  InventoryTransaction,
  ShipmentSummary,
  ShipmentInformation,
} from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const databaseApi = createApi({
  reducerPath: "databaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Products", "OrderSummary", "Inventory", "ShipmentSummary"],
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
    getShipmentSummary: builder.query<ShipmentSummary[], void>({
      query: () => "v1/shipments",
      providesTags: ["ShipmentSummary"],
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
      { orderId: string; materials: StockAmount }
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
      { items: StockAmount }
    >({
      query: (payload) => ({
        url: "v1/inventory",
        method: "PUT",
        body: payload,
      }),
    }),
    updateOrderStatus: builder.mutation<
      DatabaseActionReturnType,
      { orderId: string; status: OrderStatus; materials: StockAmount }
    >({
      query: (payload) => ({
        url: "v1/order",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["OrderSummary"],
    }),
    updateShipment: builder.mutation<
      DatabaseActionReturnType,
      ShipmentInformation
    >({
      query: (payload) => ({
        url: "v1/shipments",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["ShipmentSummary"],
    }),
    createInventoryTransaction: builder.mutation<
      DatabaseActionReturnType,
      InventoryTransaction[]
    >({
      query: (payload) => ({
        url: "v1/production",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Inventory"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetOrdersQuery,
  useGetShipmentSummaryQuery,
  useGetInventoryQuery,
  useCreateOrderMutation,
  useRestockInventoryMutation,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation,
  useUpdateShipmentMutation,
  useCreateInventoryTransactionMutation,
} = databaseApi;
