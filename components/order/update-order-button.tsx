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
import { useUpdateOrderStatusMutation } from "@/services/database";
import { useState } from "react";
import { ORDER_STATUS } from "@/lib";
import { toast } from "sonner";
import { reserveQuantity } from "@/hooks/reserve-quantity";

const UpdateOrderButton = ({ order }: { order: OrderSummary }) => {
  const [open, setOpen] = useState(false);
  const [updateOrder] = useUpdateOrderStatusMutation();

  const handleUpdateOrder = async (status: string) => {
    const materials = reserveQuantity(order.items);
    const payload = {
      orderId: order.orderId,
      status: status as OrderStatus,
      materials,
    };
    await updateOrder(payload);
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
        <div className="grid grid-cols-2 gap-4">
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
