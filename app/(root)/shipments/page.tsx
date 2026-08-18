"use client";

import DataTableHeader from "@/components/ui/data-table-header";
import { ShipmentColumns } from "./shipments-columns";
import { ShipmentsDataTable } from "./shipments-data-table";
import { useGetShipmentSummaryQuery } from "@/services/database";
import LoadingScreen from "@/components/loading-screen";

export default function Page() {
  const { data, isLoading, isFetching } = useGetShipmentSummaryQuery();
  return (
    <section className="pb-2 pt-16 pr-2 flex">
      <div className="py-8 mx-auto px-4 relative flex-1 border rounded-lg flex flex-col gap-8">
        <div className="flex flex-row items-center justify-between">
          <DataTableHeader title="Shipments" />
        </div>
        {isFetching || isLoading ? (
          <LoadingScreen />
        ) : (
          <ShipmentsDataTable
            columns={ShipmentColumns}
            data={data ? data : []}
          />
        )}
      </div>
    </section>
  );
}
