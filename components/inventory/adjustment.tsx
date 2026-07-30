import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  useCreateInventoryTransactionMutation,
  useGetInventoryQuery,
} from "@/services/database";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { InventoryActions } from "@/types";
import { useEffect, type Dispatch } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventoryTransactionSchema } from "@/lib/validation";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { Check, Loader2, Plus, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { handleErrorToast } from "@/components/handle-error-toast";
import { AppError, CreateInventoryTransactionError } from "@/types.error";
import { Separator } from "../ui/separator";

const REASON = [
  "purchase",
  "sale",
  "production",
  "adjustment",
  "damaged",
  "lost",
];

const Adjustment = ({
  setSelected,
  setOpen,
}: {
  setSelected: Dispatch<React.SetStateAction<InventoryActions | null>>;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data } = useGetInventoryQuery();

  const [insertInventoryTransaction, { error, isLoading }] =
    useCreateInventoryTransactionMutation();

  useEffect(() => {
    if (!error) return;
    handleErrorToast<AppError<CreateInventoryTransactionError>>(error);
    return;
  }, [error]);

  const inventoryAdjustmentForm = useForm({
    resolver: zodResolver(inventoryTransactionSchema),
    defaultValues: {
      inventoryTransactions: [
        { itemId: 0, changeQuantity: 0, reason: "purchase", referenceId: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: inventoryAdjustmentForm.control,
    name: "inventoryTransactions",
  });

  const handleInventoryTransactionsSubmit =
    inventoryAdjustmentForm.handleSubmit(async (values) => {
      try {
        await insertInventoryTransaction(values).unwrap();
        setOpen(false);
        toast.success("Successfully adjusted the stock!");
        inventoryAdjustmentForm.reset();
        setSelected(null);
      } catch {}
    });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Adjust stock</DialogTitle>
        <DialogDescription>Please fill in the details</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleInventoryTransactionsSubmit}>
        <FieldGroup>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <div>
                {index != 0 && <Separator className="mb-4" />}
                <div className="grid grid-cols-2 gap-2">
                  <Controller
                    control={inventoryAdjustmentForm.control}
                    name={`inventoryTransactions.${index}.itemId`}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="inventoryTransactions.itemId">
                          Product
                        </Label>

                        <Select
                          value={String(field.value)}
                          onValueChange={(e) => field.onChange(Number(e))}
                        >
                          <SelectTrigger className="w-64">
                            <SelectValue placeholder="Select an item">
                              {field.value
                                ? data?.find(
                                    (item) =>
                                      item.itemId === Number(field.value),
                                  )?.name
                                : "Select an item"}
                            </SelectValue>
                          </SelectTrigger>

                          <SelectContent>
                            <SelectGroup>
                              {data &&
                                data.map((item) => (
                                  <SelectItem
                                    key={item.itemId}
                                    value={String(item.itemId)}
                                  >
                                    {item.name}
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

                  <Controller
                    control={inventoryAdjustmentForm.control}
                    name={`inventoryTransactions.${index}.changeQuantity`}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="inventoryTransactions.changeQuantity">
                          Quantity
                        </Label>

                        <Input
                          required
                          type="number"
                          min={1}
                          className="w-24"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? "" : Number(val));
                          }}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={inventoryAdjustmentForm.control}
                    name={`inventoryTransactions.${index}.reason`}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="inventoryTransactions.reason">
                          Reason
                        </Label>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-64">
                            <SelectValue placeholder="Select a reason"></SelectValue>
                          </SelectTrigger>

                          <SelectContent>
                            <SelectGroup>
                              {REASON.map((item, i) => (
                                <SelectItem key={i} value={item}>
                                  {item.toUpperCase()}
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

                  <Controller
                    control={inventoryAdjustmentForm.control}
                    name={`inventoryTransactions.${index}.referenceId`}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="inventoryTransactions.referenceId">
                          Reference
                        </Label>

                        <Input
                          className="w-24"
                          {...field}
                          value={field.value ?? ""}
                          placeholder="Invoice"
                          onChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>

              {index > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2Icon />
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              append({
                itemId: 0,
                changeQuantity: 0,
                reason: "purchase",
              })
            }
          >
            <Plus />
            Add More Item
          </Button>
        </FieldGroup>

        <DialogFooter>
          <Button onClick={() => setSelected(null)} disabled={isLoading}>
            Back
          </Button>
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
    </>
  );
};

export default Adjustment;
