"use client";

import { InventorySummary } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export const InventoryColumns: ColumnDef<InventorySummary>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item Name" />
    ),
  },
  {
    accessorKey: "quantityOnHand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity On Hand" />
    ),
    cell: ({ row }) => {
      const raw = row.getValue("quantityOnHand");
      const onHand =
        typeof raw === "string" ? parseFloat(raw) : (raw as number);

      return (
        <div>
          {Number.isInteger(onHand) ? onHand.toString() : onHand.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "quantityReserved",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity Reserved" />
    ),
    cell: ({ row }) => {
      const raw = row.getValue("quantityReserved");
      const onHand =
        typeof raw === "string" ? parseFloat(raw) : (raw as number);

      return (
        <div>
          {Number.isInteger(onHand) ? onHand.toString() : onHand.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;

      return (
        <div>
          {type
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
        className="justify-end"
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <div className="text-right mr-4">
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
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="justify-end">
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.name)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
