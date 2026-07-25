"use client";

import { OrderSummary } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import OrderActions from "@/components/order/order-actions";

export const OrderColumns: ColumnDef<OrderSummary>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return <div>{date.split("T")[0]}</div>;
    },
  },
  {
    accessorKey: "invoice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice" />
    ),
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Name" />
    ),
  },
  {
    accessorKey: "items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items" />
    ),

    cell: ({ getValue }) => {
      const items = getValue() as { productName: string; quantity: number }[];
      return (
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <div key={item.productName}>
              {item.productName} @ {item.quantity}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),

    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <div>{status.toUpperCase()}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Amount"
        className="justify-end"
      />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);

      return <div className="text-right font-medium mr-4">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <OrderActions order={row.original} />,
  },
];
