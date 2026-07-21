import { useState } from "react";
import {
  useGetProductsQuery,
  useCreateOrderMutation,
  useUpdateInventoryMutation,
} from "@/services/database";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { inputOrderSchema, placeOrderSchema } from "@/lib/validation";
import type { InputOrder } from "@/types";
import { useEffect } from "react";
import { handleErrorToast } from "@/components/handle-error-toast";
import {
  AppError,
  GetOrderError,
  PlaceOrderError,
  UpdateInventoryError,
} from "@/types.error";
import { UpdateInventory } from "./update-inventory";

export const usePlaceOrder = () => {
  const inputOrderForm = useForm<InputOrder>({
    resolver: zodResolver(inputOrderSchema),
    defaultValues: {
      invoice: "",
      customerName: "",
      items: [{ sku: "", quantity: 0 }],
    },
  });

  const { data: products, error: productsError } = useGetProductsQuery();
  const [createOrder, { isLoading: isSubmitting, error }] =
    useCreateOrderMutation();
  const [updateInventory, { error: updateInventoryError }] =
    useUpdateInventoryMutation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!error) return;
    handleErrorToast<AppError<PlaceOrderError>>(error);
    return;
  }, [error]);
  useEffect(() => {
    if (!productsError) return;
    handleErrorToast<AppError<GetOrderError>>(productsError);
    return;
  }, [productsError]);
  // useEffect(() => {
  //   if (!updateInventoryError) return;
  //   handleErrorToast<AppError<UpdateInventoryError>>(updateInventoryError);
  //   return;
  // }, [updateInventoryError]);

  const buildOrderPayload = (orderId: string, values: InputOrder) => {
    if (!products || !products.length) return;

    const items = values.items.map((item) => {
      const product = products.find((p) => p.sku === item.sku);
      if (!product) {
        throw new Error(`Product not found for SKU: ${item.sku}`);
      }
      return {
        orderId,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal: product.price * item.quantity,
      };
    });

    const grandTotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
    const customerId = uuidv4();

    return {
      order: {
        orderId,
        invoice: values.invoice,
        customerId,
        status: "pending",
        grandTotal,
      },
      items,
      customer: {
        customerId,
        customerName: values.customerName,
      },
    };
  };

  const onSubmitOrder = inputOrderForm.handleSubmit(async (values) => {
    try {
      const payload = buildOrderPayload(uuidv4(), values);

      const parsed = placeOrderSchema.safeParse(payload);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Invalid order");
        return;
      }

      const materials = UpdateInventory(parsed.data.items);

      const orderResult = await createOrder(parsed.data).unwrap();

      if (orderResult.ok) await updateInventory(materials);

      toast.success("New order placed!");
      setOpen(false);
      inputOrderForm.reset();
    } catch {}
  });

  return { onSubmitOrder, inputOrderForm, open, setOpen, isSubmitting };
};
