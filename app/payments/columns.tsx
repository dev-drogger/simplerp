"use client";

import { Product, Sale } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "invoice",
    header: "Invoice",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "item",
    header: "Item",
    cell: ({ getValue }) => {
      const items = getValue() as Product[];

      return (
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <div key={item.id}>
              {item.name} @{item.quantity}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    // cell: ({ row }) => {
    //   return <div>{row.getValue("status").toUpperCase()}</div>;
    // },
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
