import { columns } from "./columns";
import { DataTable } from "./data-table";
import DataTableHeader from "@/components/ui/data-table-header";
import PlaceOrderButton from "@/components/place-order-button";

export default async function DemoPage() {
  const response = await fetch("http://localhost:3000/api/v1/order");
  const data = await response.json();

  return (
    <section className="pb-2 pt-16 pr-2">
      <div className="py-8 mx-auto px-4 relative size-full border rounded-lg flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <DataTableHeader title="Overview" />
          <PlaceOrderButton />
        </div>
        <DataTable columns={columns} data={data ? data : []} />
      </div>
    </section>
  );
}
