"use client";

import { PencilLine } from "lucide-react";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Dialog,
  DialogHeader,
} from "../ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { OrderStatus, OrderSummary } from "@/types";
import {
  useCreateInventoryTransactionMutation,
  useUpdateOrderStatusMutation,
} from "@/services/database";
import { useState } from "react";
import { ORDER_STATUS } from "@/lib";
import { toast } from "sonner";
import { releaseQuantity } from "@/lib/utils";
import {
  CreateInventoryTransactionError,
  AppError,
  UpdateOrderError,
} from "@/types.error";
import { handleErrorToast } from "../handle-error-toast";
import { useEffect } from "react";

const UpdateOrderButton = ({ order }: { order: OrderSummary }) => {
  const [open, setOpen] = useState(false);
  const [updateOrder, { error: updateOrderError }] =
    useUpdateOrderStatusMutation();
  const [insertInventoryTransaction, { error: inventoryTransactionError }] =
    useCreateInventoryTransactionMutation();

  useEffect(() => {
    if (!updateOrderError) return;
    handleErrorToast<AppError<UpdateOrderError>>(updateOrderError);
    return;
  }, [updateOrderError]);

  useEffect(() => {
    if (!inventoryTransactionError) return;
    handleErrorToast<AppError<CreateInventoryTransactionError>>(
      inventoryTransactionError,
    );
    return;
  }, [inventoryTransactionError]);

  const handleUpdateOrder = async (status: string) => {
    const materials = releaseQuantity(order.items);
    const payload = {
      orderId: order.orderId,
      status: status as OrderStatus,
      materials,
    };
    const inventoryTransactionPayload = materials.map((mats) => {
      return {
        itemId: mats.itemId,
        changeQuantity: mats.amount,
        reason: "sale" as const,
      };
    });

    switch (status) {
      case "completed":
        await updateOrder(payload);
        await insertInventoryTransaction(inventoryTransactionPayload);
        break;
      default:
        await updateOrder(payload);
        break;
    }

    setOpen(!open);
    toast.success("Order status updated");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <PencilLine className="text-green-500 hover:text-green-700" />
          Update
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Status</DialogTitle>
          <DialogDescription>Please select current status</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between">
          {ORDER_STATUS.map((status, index) => (
            <Button
              onClick={() => {
                handleUpdateOrder(status.value);
              }}
              key={index}
              className={`bg-transparent hover:bg-${status.styleColor}-500/10 uppercase border border-${status.styleColor}-500 text-black`}
            >
              {status.value}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateOrderButton;
