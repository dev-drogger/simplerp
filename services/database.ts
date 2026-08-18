import {
  Product,
  OrderSummary,
  PlaceOrder,
  DatabaseActionReturnType,
  StockAmount,
  OrderStatus,
  InventorySummary,
  InventoryTransactions,
  ShipmentSummary,
  ShipmentInformation,
  DashboardData,
} from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const databaseApi = createApi({
  reducerPath: "databaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: [
    "Products",
    "OrderSummary",
    "Inventories",
    "ShipmentSummary",
    "DashboardData",
  ],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => `/v1/products`,
      providesTags: ["Products"],
      keepUnusedDataFor: 60 * 60,
    }),
    getOrders: builder.query<OrderSummary[], void>({
      query: () => "v1/orders",
      providesTags: ["OrderSummary"],
      keepUnusedDataFor: 60 * 60,
    }),
    getInventory: builder.query<InventorySummary[], void>({
      query: () => "v1/inventories",
      providesTags: ["Inventories"],
      keepUnusedDataFor: 60 * 60,
    }),
    getShipmentSummary: builder.query<ShipmentSummary[], void>({
      query: () => "v1/shipments",
      providesTags: ["ShipmentSummary"],
      keepUnusedDataFor: 60 * 60,
    }),
    getDashboardData: builder.query<DashboardData, void>({
      query: () => "v1/dashboard",
      providesTags: ["DashboardData"],
      keepUnusedDataFor: 60 * 60,
    }),
    createOrder: builder.mutation<DatabaseActionReturnType, PlaceOrder>({
      query: (placeOrderForm) => ({
        url: "/v1/orders",
        method: "POST",
        body: placeOrderForm,
      }),
      invalidatesTags: ["OrderSummary", "Inventories", "DashboardData"],
    }),
    deleteOrder: builder.mutation<
      DatabaseActionReturnType,
      { orderId: string; materials: StockAmount }
    >({
      query: (payload) => ({
        url: "/v1/orders",
        method: "delete",
        body: payload,
      }),
      invalidatesTags: ["OrderSummary"],
    }),
    restockInventory: builder.mutation<
      DatabaseActionReturnType,
      { stockAmount: StockAmount }
    >({
      query: (payload) => ({
        url: "v1/inventories",
        method: "PUT",
        body: payload,
      }),
    }),
    updateOrderStatus: builder.mutation<
      DatabaseActionReturnType,
      { orderId: string; status: OrderStatus; materials: StockAmount }
    >({
      query: (payload) => ({
        url: "v1/orders",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["OrderSummary", "DashboardData", "Inventories"],
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
      invalidatesTags: ["ShipmentSummary", "DashboardData"],
    }),
    createInventoryTransaction: builder.mutation<
      DatabaseActionReturnType,
      InventoryTransactions[]
    >({
      query: (inventoryTransactions) => ({
        url: "v1/inventory-transaction",
        method: "POST",
        body: inventoryTransactions,
      }),
      invalidatesTags: ["Inventories"],
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
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
