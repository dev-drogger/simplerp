import { Metadata } from "next";
import ShipmentsSection from "./shipments-sections";

export const metadata: Metadata = {
  title: "Shipments",
};

export default function Page() {
  return <ShipmentsSection />
}
