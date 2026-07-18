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

const OrderForm = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  const { onSubmitOrder, inputOrderForm, open, setOpen } = usePlaceOrder();

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
      <form onSubmit={inputOrderForm.handleSubmit(onSubmitOrder)}>
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
            <Controller
              name="status"
              control={inputOrderForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="status">Status</Label>

                  <Select
                    value={field.value ?? "pending"}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>

                    <SelectContent>
                      {saleStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Controller
                  control={inputOrderForm.control}
                  name={`items.${index}.sku`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {products &&
                            products.map((product) => (
                              <SelectItem key={product.sku} value={product.sku}>
                                {product.productName}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                <span className="text-muted-foreground">@</span>

                <Controller
                  control={inputOrderForm.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <Input
                      type="number"
                      min={1}
                      className="w-24"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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
            {/* <Button type="submit">Save changes</Button> */}
            <Button onClick={() => onSubmitOrder()}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default OrderForm;
