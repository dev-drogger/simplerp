import { handleErrorToast } from "@/components/handle-error-toast";
import { AppError, UpdateInventoryError } from "@/types.error";
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
  useGetInventoryQuery,
  useRestockInventoryMutation,
} from "@/services/database";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { InventoryActions } from "@/types";
import { type Dispatch, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stockAmountSchema } from "@/lib/validation";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { Check, Loader2, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

const Restock = ({
  setSelected,
  setOpen,
}: {
  setSelected: Dispatch<React.SetStateAction<InventoryActions | null>>;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data } = useGetInventoryQuery();

  const [restock, { isLoading, error }] = useRestockInventoryMutation();

  useEffect(() => {
    if (!error) return;
    handleErrorToast<AppError<UpdateInventoryError>>(error);
    return;
  }, [error]);

  const restockForm = useForm({
    resolver: zodResolver(stockAmountSchema),
    defaultValues: {
      stockAmount: [{ itemId: 0, amount: 0 }],
    },
  });

  const formItems = restockForm.getValues("stockAmount");
  const { fields, append, remove } = useFieldArray({
    control: restockForm.control,
    name: "stockAmount",
  });

  const handleRestockSubmit = restockForm.handleSubmit(async (values) => {
    try {
      await restock(values).unwrap();
      setOpen(false);
      toast.success("Successfully restocked!");
      restockForm.reset();
    } catch {}
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Restock</DialogTitle>
        <DialogDescription>Please fill in the details</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleRestockSubmit}>
        <FieldGroup>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <Controller
                control={restockForm.control}
                name={`stockAmount.${index}.itemId`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Label htmlFor="stockAmount.itemId">Item</Label>

                    <Select
                      value={String(field.value)}
                      onValueChange={(e) => field.onChange(Number(e))}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select item">
                          {field.value
                            ? data?.find((item) => item.itemId === field.value)
                                ?.name
                            : "Select item"}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {data &&
                            data
                              .filter(
                                (item) =>
                                  !formItems.some(
                                    (i) => i.itemId === item.itemId,
                                  ) && !item.name.includes("Nayanaka"),
                              )
                              .map((item) => (
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
                control={restockForm.control}
                name={`stockAmount.${index}.amount`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Label htmlFor="stockAmount.amount">Quantity</Label>

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

              {index > 0 ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2Icon />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  className="opacity-0"
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
                amount: 0,
              })
            }
          >
            Add More Item
          </Button>
        </FieldGroup>

        <DialogFooter>
          <Button
            onClick={() => setSelected(null)}
            type="button"
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
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

export default Restock;
