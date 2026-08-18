"use client";

import LoadingScreen from "@/components/loading-screen";
import { Button } from "@/components/ui/button";
import { useGetDashboardDataQuery } from "@/services/database";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const { data, isLoading } = useGetDashboardDataQuery();
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <section className="pb-2 pt-16 pr-2 flex">
          <div className="py-8 mx-auto px-4 relative flex-1 border rounded-lg flex flex-col gap-8">
            <div className="flex gap-2 items-start flex-col">
              <h2 className="text-5xl">Welcome Back, Visitor!</h2>
              <p className="font-light">
                Get a quick look at your store&apos;s performance
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 size-full">
              {data &&
                Object.entries(data).map(([key, data]) => {
                  const amount = data.value;
                  const formatted = new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(amount);

                  return (
                    <div
                      key={key}
                      className="border p-4 flex flex-col bg-gray-200 justify-between gap-2 rounded-lg"
                    >
                      <h3>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (char) => char.toUpperCase())}
                      </h3>
                      <div>
                        <h3 className="text-7xl">
                          {key === "monthlyRevenue" ? formatted : data.value}
                        </h3>
                      </div>
                      <Link href={data.link} className="self-end">
                        <Button className="bg-gray-100 text-black hover:bg-gray-300 w-28">
                          View More <ArrowRight />
                        </Button>
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Page;
