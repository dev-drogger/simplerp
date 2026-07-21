"use client";

import { Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, Trash2Icon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "./ui/select";
import { useGetProductsQuery } from "@/services/database";
import { usePlaceOrder } from "@/hooks/use-place-order";
import { AppError, GetProductsError } from "@/types.error";
import { handleErrorToast } from "./handle-error-toast";
import { useEffect } from "react";

const PlaceOrderButton = () => {
  const { data: products, error } = useGetProductsQuery();

  const { onSubmitOrder, inputOrderForm, open, setOpen } = usePlaceOrder();

  useEffect(() => {
    if (!error) return;
    handleErrorToast<AppError<GetProductsError>>(error);
    return;
  }, [error]);

  const saleStatuses = [
    "completed",
    "shipped",
    "cancelled",
    "returned",
    "pending",
  ];

  const { fields, append, remove } = useFieldArray({
    control: inputOrderForm.control,
    name: "items",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          New Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add new sale</DialogTitle>
          <DialogDescription>
            Fill in the details for the new sale.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmitOrder}>
          <FieldGroup>
            <Controller
              name="invoice"
              control={inputOrderForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="order.invoice">Invoice</Label>
                  <Input
                    id="invoice"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Invoice number"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="customerName"
              control={inputOrderForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="customerName">Customer</Label>
                  <Input
                    id="customerName"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Customer name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2">
                <Controller
                  control={inputOrderForm.control}
                  name={`items.${index}.sku`}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="items.sku">Product</Label>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-64">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            {products &&
                              products.map((product) => (
                                <SelectItem
                                  key={product.sku}
                                  value={product.sku}
                                >
                                  {product.productName}
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

                {/* <span className="text-muted-foreground">@</span> */}

                <Controller
                  control={inputOrderForm.control}
                  name={`items.${index}.quantity`}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="items.quantity">Quantity</Label>

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

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2Icon />
                </Button>
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
              Add Product
            </Button>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceOrderButton;
