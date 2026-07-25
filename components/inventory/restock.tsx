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
import { useGetInventoryQuery } from "@/services/database";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { InventoryActions } from "@/types";
import type { Dispatch } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { itemsQuantitySchema } from "@/lib/validation";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { Check, Trash2Icon } from "lucide-react";

const Restock = ({
  setSelected,
}: {
  setSelected: Dispatch<React.SetStateAction<InventoryActions | null>>;
}) => {
  const { data } = useGetInventoryQuery();

  const restockForm = useForm({
    resolver: zodResolver(itemsQuantitySchema),
    defaultValues: {
      items: [{ itemId: 0, amount: 0 }],
    },
  });

  // const formItems = restockForm.watch("items");
  const { fields, append, remove } = useFieldArray({
    control: restockForm.control,
    name: "items",
  });

  const handleRestockSubmit = restockForm.handleSubmit(async (values) => {
    console.log("restock form val", values);
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
                name={`items.${index}.itemId`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Label htmlFor="">Item</Label>

                    <Select
                      value={String(field.value)}
                      onValueChange={(e) => field.onChange(Number(e))}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {data &&
                            //   data
                            //       .filter(
                            //         (item) =>
                            //           !formItems.some(
                            //             (i) => i.itemId === item.itemId,
                            //           ),
                            //       )
                            //       .map(
                            //         (item) =>
                            //           !item.name.includes("something") && (
                            //             <SelectItem
                            //               key={item.itemId}
                            //               value={String(item.itemId)}
                            //             >
                            //               {item.name}
                            //             </SelectItem>
                            //           ),
                            //       )
                            data.map(
                              (item) =>
                                !item.name.includes("Nayanaka") && (
                                  <SelectItem
                                    key={item.itemId}
                                    value={String(item.itemId)}
                                  >
                                    {item.name}
                                  </SelectItem>
                                ),
                            )}
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
                name={`items.${index}.amount`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Label htmlFor="items.amount">Quantity</Label>

                    <Input
                      type="number"
                      min={1}
                      className="w-24"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
          <Button onClick={() => setSelected(null)}>Back</Button>
          <Button
            type="submit"
            className="bg-green-500 text-white w-20 hover:bg-green-700"
          >
            <Check />
            Save
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default Restock;
