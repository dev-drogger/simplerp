import { fetchRevenue } from "@/db/actions/dashboard";
import { NextResponse } from "next/server";

export const GET = async () => {
  const result = await fetchRevenue();

  return result.match(
    (res) => {
      return NextResponse.json(res, { status: 200 });
    },
    (err) => {
      const type = err.type;

      switch (type) {
        case "DB_REVENUE_RETRIEVAL_ERROR": {
          return NextResponse.json(err, { status: 404 });
        }
        case "DATABASE_ERROR": {
          return NextResponse.json(err, { status: 500 });
        }
        default: {
          throw new Error(`Unhandled error: ${type satisfies never}`);
        }
      }
    },
  );
};
