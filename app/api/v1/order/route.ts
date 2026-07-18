import { fetchOrderSummary } from "@/db/actions/order";
import { insertPlaceOrder } from "@/db/actions/place-order";
import { placeOrderSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const result = await fetchOrderSummary();

  return result.match(
    (res) => {
      return NextResponse.json(res, { status: 200 });
    },
    (err) => {
      const type = err.type;

      switch (type) {
        case "DB_ORDER_RETRIEVAL_ERROR": {
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

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const parsed = placeOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        type: "VALIDATION_ERROR",
        error: parsed.error,
      },
      { status: 400 },
    );
  }

  const result = await insertPlaceOrder(parsed.data);

  return result.match(
    (data) => NextResponse.json(data, { status: 201 }),
    (err) => {
      switch (err.type) {
        case "DB_CUSTOMER_CREATION_ERROR":
        case "DB_ORDER_CREATION_ERROR":
        case "DB_ORDER_ITEMS_CREATION_ERROR":
          return NextResponse.json(err, { status: 500 });

        case "DATABASE_ERROR":
          return NextResponse.json(err, { status: 500 });

        default:
          throw new Error(`Unhandled error: ${err satisfies never}`);
      }
    },
  );
};

// export const PUT = async (req: NextRequest) => {};

// export const DELETE = async (req: NextRequest) => {};
