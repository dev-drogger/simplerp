"use client";

import { v4 as uuidv4 } from "uuid";
import { OrderItems, Customer } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
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
import { ordersSchema } from "@/lib/validation";
import { usePlaceOrder } from "@/hooks/use-place-order";

const SaleForm = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  // const placeOrderForm = useForm<z.infer<typeof ordersSchema>>({
  //   resolver: zodResolver(ordersSchema),
  //   defaultValues: {
  //     order: { status: "pending" },
  //     items: [{ sku: "", quantity: 0 }],
  //   },
  // });

  const { onSubmitOrder, placeOrderForm } = usePlaceOrder();

  const saleStatuses = [
    "completed",
    "shipped",
    "cancelled",
    "returned",
    "pending",
  ];

  const { fields, append, remove } = useFieldArray({
    control: placeOrderForm.control,
    name: "items",
  });

  // const value = placeOrderForm.getValues();
  // const orderId = uuidv4();
  // const createOrderItems = () => {
  //   return value.items.map((item) => {
  //     const price = products?.find((p) => p.sku === item.sku).price;
  //     return {
  //       orderItemId: uuidv4(),
  //       orderId: orderId,
  //       sku: item.sku,
  //       quantity: item.quantity,
  //       unitPrice: price,
  //       lineTotal: price * item.quantity,
  //     };
  //   });
  // };

  // const createOrder = (orderItems: OrderItems[], customer: Customer) => {
  //   let grandTotal = 0;
  //   orderItems.forEach((item) => {
  //     grandTotal += item.lineTotal;
  //   });
  //   return {
  //     orderId: orderId,
  //     invoice: value.order.invoice,
  //     customerId: customer.customerId,
  //     status: value.order.status,
  //     grandTotal: grandTotal,
  //   };
  // };

  // const createCustomer = () => {
  //   return {
  //     customerId: uuidv4(),
  //     customerName: value.customer.customerName,
  //   };
  // };

  // const onSubmit = (data?) => {
  //   const orderItems = createOrderItems();
  //   const customer = createCustomer();
  //   const order = createOrder(orderItems, customer);

  //   console.log(orderItems, customer, order);
  // };
  return (
    <Dialog>
      <form onSubmit={placeOrderForm.handleSubmit(onSubmitOrder)}>
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
              name="order.invoice"
              control={placeOrderForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="order.invoice">Invoice</Label>
                  <Input
                    id="order.invoice"
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
              name="customer.customerName"
              control={placeOrderForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="customer.name">Customer</Label>
                  <Input
                    id="customer.customerName"
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
              name="order.status"
              control={placeOrderForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="order.status">Status</Label>

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
                  control={placeOrderForm.control}
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
                  control={placeOrderForm.control}
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
                  orderItemId: "",
                  orderId: "",
                  unitPrice: 0,
                  lineTotal: 0,
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

export default SaleForm;
