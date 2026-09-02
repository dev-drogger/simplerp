import { Metadata } from "next";
import InventoriesSection from "./inventories-section";

export const metadata: Metadata = {
  title: "Inventories",
};

export default function Page() {
  return <InventoriesSection />
}
