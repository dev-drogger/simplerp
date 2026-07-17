import { useGetProductsQuery } from "@/services/database";
import { v4 as uuidv4 } from "uuid";
import { ordersSchema } from "@/lib/validation";
import type { UseFormReturn } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const usePlaceOrder = () => {
  const placeOrderForm = useForm<z.infer<typeof ordersSchema>>({
    resolver: zodResolver(ordersSchema),
    defaultValues: {
      order: { status: "pending" },
      items: [{ sku: "", quantity: 0 }],
    },
  });
  const { data: products } = useGetProductsQuery();

  const createOrderItems = (orderId: string) => {
    const formValue = placeOrderForm.getValues();
    return formValue.items.map((item) => {
      const price = products?.find((p) => p.sku === item.sku).price;
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
    const formValue = placeOrderForm.getValues();
    const orderItems = createOrderItems(orderId);

    placeOrderForm.setValue("items", orderItems);

    const customer = {
      customerId: uuidv4(),
      customerName: formValue.customer.customerName,
    };
    placeOrderForm.setValue("customer", customer);

    const grandTotal = orderItems.reduce((sum, i) => sum + i.lineTotal, 0);

    return {
      orderId: orderId,
      invoice: formValue.order.invoice,
      customerId: customer.customerId,
      status: formValue.order.status,
      grandTotal: grandTotal,
    };
  };

  const onSubmitOrder = async () => {
    const orderId = uuidv4();

    placeOrderForm.setValue("order", createOrder(orderId));

    const newValue = placeOrderForm.getValues();

    console.log(newValue);
  };

  return { onSubmitOrder, placeOrderForm };
};
