import { Loader2, Trash2Icon } from "lucide-react";
import { OrderSummary } from "@/types";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteOrderMutation } from "@/services/database";
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
import { releaseQuantity } from "@/lib/utils";
import { handleErrorToast } from "@/components/handle-error-toast";
import { AppError, CreateInventoryTransactionError } from "@/types.error";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DeleteOrderButton = ({ order }: { order: OrderSummary }) => {
  const [open, setOpen] = useState(false);
  const [deleteOrder, { isLoading, error }] = useDeleteOrderMutation();

  useEffect(() => {
    if (!error) return;
    handleErrorToast<AppError<CreateInventoryTransactionError>>(error);
    return;
  }, [error]);

  const materials = releaseQuantity(order.items);

  const final = {
    orderId: order.orderId,
    materials,
  };

  const handleDelete = async () => {
    try {
      await deleteOrder(final);
      setOpen(false);
      toast.success("Successfully deleted the order!");
    } catch {}
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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
            className="bg-red-500 text-white hover:bg-red-700 hover:text-white w-20"
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
