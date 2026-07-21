"use client";

import { OrderReturnType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<OrderReturnType>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return <div>{date.split("T")[0]}</div>;
    },
  },
  {
    accessorKey: "invoice",
    header: "Invoice",
  },
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ getValue }) => {
      const items = getValue() as { productName: string; quantity: number }[];

      return (
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <div key={item.productName}>
              {item.productName} @{item.quantity}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <div>{status.toUpperCase()}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
