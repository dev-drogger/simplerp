import { fetchInventorySummary, updateInventory } from "@/db/actions/inventory";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const result = await fetchInventorySummary();

  return result.match(
    (res) => {
      return NextResponse.json(res, { status: 200 });
    },
    (err) => {
      const type = err.type;

      switch (type) {
        case "DB_INVENTORY_RETRIEVAL_ERROR": {
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

export const PUT = async (request: NextRequest) => {
  const body = await request.json();
  const result = await updateInventory(body);

  return result.match(
    (res) => {
      return NextResponse.json(res, { status: 200 });
    },
    (err) => {
      const type = err.type;

      switch (type) {
        case "DB_INVENTORY_UPDATE_ERROR": {
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

// export const DELETE = async (req: NextRequest) => {};
