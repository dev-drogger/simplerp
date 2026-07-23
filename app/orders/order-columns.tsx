"use client";

import { Loader2, MoreHorizontal, PencilLine, Trash2Icon } from "lucide-react";
import { OrderSummary } from "@/types";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteOrderMutation } from "@/services/database";
import { reserveQuantity } from "@/hooks/reserve-quantity";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const OrderAction = ({ order }: { order: OrderSummary }) => {
  const [deleteOrder, { isPending }] = useDeleteOrderMutation();

  const materials = reserveQuantity(order.items);

  const final = {
    orderId: order.orderId,
    materials,
  };

  const handleDelete = async () => {
    await deleteOrder(final);
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <PencilLine className="text-green-500 hover:text-green-700" />
            Update
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <Trash2Icon className="text-red-500 hover:text-red-700" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {order.invoice}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove this order and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleDelete}
            className="bg-red-500 text-white hover:bg-red-700 hover:text-white"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const OrderColumns: ColumnDef<OrderSummary>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div
        className="font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
      </div>
    ),
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return <div>{date.split("T")[0]}</div>;
    },
  },
  {
    accessorKey: "invoice",
    header: ({ column }) => (
      <div
        className="font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Invoice
      </div>
    ),
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <div
        className="font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
      </div>
    ),
  },
  {
    accessorKey: "items",
    header: ({ column }) => (
      <div
        className="font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Items
      </div>
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
      <div
        className="font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
      </div>
    ),

    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <div>{status.toUpperCase()}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div
        className="text-right font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
      </div>
    ),
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
  {
    id: "actions",
    cell: ({ row }) => <OrderAction order={row.original} />,
  },
];
