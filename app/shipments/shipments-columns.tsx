"use client";

import { ShipmentSummary } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import ShipmentActions from "@/components/inventory/shipment-actions";

export const ShipmentColumns: ColumnDef<ShipmentSummary>[] = [
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
    accessorKey: "shipmentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shipment ID" />
    ),
  },
  {
    accessorKey: "shipmentDetails",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Details" />
    ),
  },
  {
    accessorKey: "orderDetails",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Details" />
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
    accessorKey: "shipmentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("shipmentStatus") as string;

      return (
        <div className="mr-4">
          {status
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ShipmentActions shipment={row.original} />,
  },
];
