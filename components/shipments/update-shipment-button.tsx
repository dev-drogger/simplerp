import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "../ui/select";
import { PencilLine } from "lucide-react";
import { Button } from "../ui/button";
import { useUpdateShipmentMutation } from "@/services/database";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ShipmentSummary } from "@/types";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateShipmentSchema } from "@/lib/validation";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { handleErrorToast } from "@/components/handle-error-toast";
import { AppError, UpdateShipmentsError } from "@/types.error";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Textarea } from "../ui/textarea";

const REASON = [
  "pending",
  "packed",
  "delivered",
  "lost",
  "returned",
  "cancelled",
  "on_delivery",
  "failed_delivery",
];

const UpdateShipmentButton = ({ shipment }: { shipment: ShipmentSummary }) => {
  const [updateShipment, { error, isLoading }] = useUpdateShipmentMutation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!error) return;
    handleErrorToast<AppError<UpdateShipmentsError>>(error);
    return;
  }, [error]);

  const updateShipmentForm = useForm({
    resolver: zodResolver(updateShipmentSchema),
    defaultValues: {
      orderId: shipment.orderId,
      shipmentId: shipment.shipmentId,
      shipmentDetails: shipment.shipmentDetails,
      shipmentStatus: shipment.shipmentStatus,
    },
  });

  const handleShipmentSubmit = updateShipmentForm.handleSubmit(
    async (values) => {
      try {
        // switch (values.shipmentStatus) {
        //   case "lost":

        //   }
        await updateShipment(values).unwrap();
        setOpen(!open);
        toast.success("Successfully updated the shipment!");
        updateShipmentForm.reset();
      } catch {}
    },
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();

          setTimeout(() => setOpen(true), 0);
        }}
      >
        <PencilLine className="text-green-500 hover:text-green-700" />
        Update
      </DropdownMenuItem>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust stock</DialogTitle>
          <DialogDescription>Please fill in the details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleShipmentSubmit} className="space-y-6">
          <FieldGroup>
            <div className="flex flex-col gap-2">
              <Controller
                control={updateShipmentForm.control}
                name={`shipmentId`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Label htmlFor="shipmentId">Shipment ID</Label>
                    <Input
                      required
                      id="shipmentId"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Please input the ID from logistic service"
                      autoComplete="off"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={updateShipmentForm.control}
                name={`shipmentDetails`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="shipmentDetails">Details</FieldLabel>
                    <FieldDescription>
                      Please fill in the shipment details
                    </FieldDescription>
                    <Textarea
                      required
                      id="shipmentDetails"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Type the details here"
                      autoComplete="off"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={updateShipmentForm.control}
                name={`shipmentStatus`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Label htmlFor="shipmentStatus">Status</Label>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select a reason"></SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {REASON.map((item, i) => (
                            <SelectItem key={i} value={item}>
                              {item
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1),
                                )
                                .join(" ")}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={isLoading}>Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 text-white w-20 hover:bg-green-700"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Check />
                  Save
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateShipmentButton;
