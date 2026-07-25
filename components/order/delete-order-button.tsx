import { Loader2, Trash2Icon } from "lucide-react";
import { OrderSummary } from "@/types";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
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

const DeleteOrderButton = ({ order }: { order: OrderSummary }) => {
  const [deleteOrder, { isLoading }] = useDeleteOrderMutation();

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
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          <Trash2Icon className="text-red-500" />
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {order.invoice}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove this order and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={handleDelete}
            className="bg-red-500 text-white hover:bg-red-700 hover:text-white"
          >
            {isLoading ? (
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

export default DeleteOrderButton;
