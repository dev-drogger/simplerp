"use client"

import { OrderColumns } from "./order-columns";
import { OrderDataTable } from "./order-data-table";
import DataTableHeader from "@/components/ui/data-table-header";
import { useGetOrdersQuery } from "@/services/database";
import LoadingScreen from "@/components/loading-screen";

const OrdersSection = () => {
        const { data, isLoading, isFetching } = useGetOrdersQuery();

        return (
                <section className="pb-2 pt-16 pr-2 flex">
                        <div className="py-8 mx-auto px-4 relative flex-1 border rounded-lg flex flex-col gap-8">
                                <div className="flex flex-row items-center justify-between">
                                        <DataTableHeader title="Orders" />
                                </div>

                                {isLoading || isFetching ? (
                                        <LoadingScreen />
                                ) : (
                                        <OrderDataTable columns={OrderColumns} data={data ? data : []} />
                                )}
                        </div>
                </section>
        )
}

export default OrdersSection 
