import { fetchOrders } from "@/db/actions/orders";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const result = await fetchOrders();

  return result.match(
    (res) => {
      return NextResponse.json(res, { status: 200 });
    },
    (err) => {
      const type = err.type;

      switch (type) {
        case "DB_ORDERS_RETRIEVAL_ERROR": {
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

// export const POST = async (req: NextRequest) => {};

// export const PUT = async (req: NextRequest) => {};

// export const DELETE = async (req: NextRequest) => {};
