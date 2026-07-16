import DataTableHeader from "@/components/ui/data-table-header";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Inventory, Payment } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];
}
async function getInventoryData(): Promise<Inventory[]> {
  // Fetch data from your API here.
  return [
    {
      id: "NPGEISHA",
      name: "Geisha",
      quantity: 31,
      status: "in-stock",
      category: "women",
    },
    {
      id: "NPHANA",
      name: "Hana",
      quantity: 31,
      status: "in-stock",
      category: "women",
    },
  ];
}

export default async function DemoPage() {
  const data = await getData();
  const inventoryData = await getInventoryData();
  return (
    <section className="pb-2 pt-16 pr-2">
      <div className="py-8 mx-auto px-4 relative size-full border rounded-lg flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <DataTableHeader title="Overview" />
          <Button>
            <PlusIcon />
            Add new entry
          </Button>
        </div>
        <DataTable columns={columns} data={inventoryData} />
      </div>
    </section>
  );
}
