import { MoreHorizontal } from "lucide-react";
import { OrderSummary } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UpdateOrderButton from "@/components/order/update-order-button";
import DeleteOrderButton from "./delete-order-button";

const OrderActions = ({ order }: { order: OrderSummary }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <UpdateOrderButton order={order} />
        <DeleteOrderButton order={order} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderActions;
