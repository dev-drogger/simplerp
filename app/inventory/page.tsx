import DataTableHeader from "@/components/ui/data-table-header";
import { InventoryColumns } from "./inventory-columns";
import { InventoryDataTable } from "./inventory-data-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default async function DemoPage() {
  const response = await fetch("http://localhost:3000/api/v1/inventory");
  const data = await response.json();
  return (
    <section className="pb-2 pt-16 pr-2 flex">
      <div className="py-8 mx-auto px-4 relative flex-1 border rounded-lg flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <DataTableHeader title="Overview" />
          <Button>
            <PlusIcon />
            Add new entry
          </Button>
        </div>
        <InventoryDataTable columns={InventoryColumns} data={data} />
      </div>
    </section>
  );
}
