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
  useGetProductsQuery,
  useCreateInventoryTransactionMutation,
} from "@/services/database";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { InventoryActions } from "@/types";
import { useEffect, type Dispatch } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productsSchema } from "@/lib/validation";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { Check, Loader2, Plus, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { calculateMaterialUsage } from "@/lib/utils";
import { handleErrorToast } from "@/components/handle-error-toast";
import { AppError, CreateInventoryTransactionError } from "@/types.error";

const Production = ({
  setSelected,
  setOpen,
}: {
  setSelected: Dispatch<React.SetStateAction<InventoryActions | null>>;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data } = useGetProductsQuery();

  const [insertInventoryTransaction, { error, isLoading }] =
    useCreateInventoryTransactionMutation();

  useEffect(() => {
    if (!error) return;
    handleErrorToast<AppError<CreateInventoryTransactionError>>(error);
    return;
  }, [error]);

  const productionForm = useForm({
    resolver: zodResolver(productsSchema),
    defaultValues: {
      products: [{ sku: "", quantity: 0 }],
    },
  });

  const formItems = productionForm.getValues("products");
  const { fields, append, remove } = useFieldArray({
    control: productionForm.control,
    name: "products",
  });

  const handleRestockSubmit = productionForm.handleSubmit(async (values) => {
    const materials = calculateMaterialUsage(values.products);
    const inventoryTransactionPayload = materials.map((mats) => {
      return {
        itemId: mats.itemId,
        changeQuantity: mats.amount,
        reason: "production" as const,
      };
    });

    try {
      await insertInventoryTransaction(inventoryTransactionPayload).unwrap();
      setOpen(false);
      toast.success("Successfully adjusted products stock!");
      productionForm.reset();
      setSelected(null);
    } catch {}
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Production</DialogTitle>
        <DialogDescription>Please fill in the details</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleRestockSubmit}>
        <FieldGroup>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <Controller
                control={productionForm.control}
                name={`products.${index}.sku`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Label htmlFor="products.sku">Product</Label>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select item">
                          {field.value
                            ? data?.find((item) => item.sku === field.value)
                                ?.productName
                            : "Select product"}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {data &&
                            data
                              .filter(
                                (item) =>
                                  !formItems.some((i) => i.sku === item.sku),
                              )
                              .map((item) => (
                                <SelectItem key={item.sku} value={item.sku}>
                                  {item.productName}
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
                control={productionForm.control}
                name={`products.${index}.quantity`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Label htmlFor="products.quantity">Quantity</Label>

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
                sku: "",
                quantity: 0,
              })
            }
          >
            <Plus />
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

export default Production;
