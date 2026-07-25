"use client";

import DataTableHeader from "@/components/ui/data-table-header";
import { InventoryColumns } from "./inventory-columns";
import { InventoryDataTable } from "./inventory-data-table";
import AdjustInventoryButton from "@/components/inventory/adjust-inventory-button";
import { useGetInventoryQuery } from "@/services/database";
import LoadingScreen from "@/components/loading-screen";

export default function Page() {
  const { data, isLoading, isFetching } = useGetInventoryQuery();
  return (
    <section className="pb-2 pt-16 pr-2 flex">
      <div className="py-8 mx-auto px-4 relative flex-1 border rounded-lg flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <DataTableHeader title="Overview" />
          <AdjustInventoryButton />
        </div>
        {isFetching || isLoading ? (
          <LoadingScreen />
        ) : (
          <InventoryDataTable
            columns={InventoryColumns}
            data={data ? data : []}
          />
        )}
      </div>
    </section>
  );
}
