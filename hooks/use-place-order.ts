import { useState } from "react";
import { useGetProductsQuery } from "@/services/database";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  inputOrderSchema,
  insertOrdersSchema,
  placeOrderSchema,
} from "@/lib/validation";

export const usePlaceOrder = () => {
  const placeOrderForm = useForm<z.infer<typeof placeOrderSchema>>({
    resolver: zodResolver(placeOrderSchema),
    defaultValues: {
      items: [{ sku: "", quantity: 0 }],
    },
  });
  const inputOrderForm = useForm<z.infer<typeof inputOrderSchema>>({
    resolver: zodResolver(inputOrderSchema),
    defaultValues: {
      status: "pending",
      items: [{ sku: "", quantity: 0 }],
    },
  });
  const { data: products } = useGetProductsQuery();

  const [open, setOpen] = useState(false);

  const createOrderItems = (orderId: string) => {
    if (!products || !products[0]) return [];
    const formValue = inputOrderForm.getValues();
    return formValue.items.map((item) => {
      const product = products.find((p) => p.sku === item.sku);
      const price = product!.price;
      return {
        orderItemId: uuidv4(),
        orderId: orderId,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: price,
        lineTotal: price * item.quantity,
      };
    });
  };

  const createOrder = (orderId: string) => {
    const formValue = inputOrderForm.getValues();
    const orderItems = createOrderItems(orderId);

    placeOrderForm.setValue("items", orderItems);

    const customer = {
      customerId: uuidv4(),
      customerName: formValue.customerName,
    };
    placeOrderForm.setValue("customer", customer);

    const grandTotal = orderItems.reduce((sum, i) => sum + i.lineTotal, 0);

    return {
      orderId: orderId,
      invoice: formValue.invoice,
      customerId: customer.customerId,
      status: formValue.status,
      grandTotal: grandTotal,
    };
  };

  const onSubmitOrder = async () => {
    const orderId = uuidv4();

    const inputOrderFormValue = inputOrderForm.getValues();

    const parsedInputOrderForm =
      inputOrderSchema.safeParse(inputOrderFormValue);

    if (!parsedInputOrderForm.success) return toast.error("error");

    const order = createOrder(orderId);

    const parsedOrder = insertOrdersSchema.safeParse(order);

    if (!parsedOrder.success) return toast.error("error");

    placeOrderForm.setValue("order", parsedOrder.data);

    const placeOrderFormValue = placeOrderForm.getValues();
    const parsedPlaceOrderFormValue =
      placeOrderSchema.safeParse(placeOrderFormValue);

    if (!parsedPlaceOrderFormValue.success) return toast.error("error");

    toast.success("Successfully place a new order");
    setOpen(!open);
  };

  return { onSubmitOrder, placeOrderForm, inputOrderForm, open, setOpen };
};
