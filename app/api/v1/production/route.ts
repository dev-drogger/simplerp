import { insertInventoryTransaction } from "@/db/actions/inventory-transaction";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest) => {
  const body = await request.json();
  const result = await insertInventoryTransaction(body);

  result.match(
    (data) => NextResponse.json(data, { status: 200 }),
    (err) => {
      switch (err.type) {
        case "DB_INVENTORY_TRANSACTION_CREATION_ERROR":
        case "DATABASE_ERROR":
          return NextResponse.json(err, { status: 500 });
        default:
          throw new Error(`Unhandled error: ${err.type satisfies never}`);
      }
    },
  );

  return NextResponse.json(result, { status: 200 });
};
