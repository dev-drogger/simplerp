import { Metadata } from "next";
import OrdersSection from "./orders-section";

export const metadata: Metadata = {
  title: "Orders",
};

export default function Page() {

  return <OrdersSection />
}
