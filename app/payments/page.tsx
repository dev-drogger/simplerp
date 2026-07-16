import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Sale } from "@/types";
import DataTableHeader from "@/components/ui/data-table-header";
import { Button } from "@/components/ui/button";
import { AddSaleButton } from "@/components/add-sale-button";
import SaleForm from "@/components/sale-form";

async function getData(): Promise<Sale[]> {
  return [
    {
      date: "2023-08-01",
      invoice: "INV20299184",
      status: "pending",
      item: [
        {
          id: "NPGEISHA",
          name: "Geisha",
          price: 69999,
          quantity: 1,
          category: "women",
        },
        {
          id: "NPHANA",
          name: "Hana",
          price: 69999,
          quantity: 1,
          category: "women",
        },
      ],
      customer: "Mirza",
      amount: 69999,
    },
    // ...
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <section className="pb-2 pt-16 pr-2">
      <div className="py-8 mx-auto px-4 relative size-full border rounded-lg flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <DataTableHeader title="Overview" />
          <SaleForm />
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  );
}
