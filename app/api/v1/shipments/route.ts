import { getShipmentSummary, updateShipment } from "@/db/actions/shipments";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const result = await getShipmentSummary();

  return result.match(
    (data) => {
      return NextResponse.json(data, { status: 200 });
    },
    (err) => {
      switch (err.type) {
        case "DATABASE_ERROR":
        case "DB_SHIPMENTS_RETRIEVAL_ERROR":
          return NextResponse.json(err, { status: 500 });
        default:
          throw new Error(`Unhandled error: ${err.type satisfies never}`);
      }
    },
  );
};

export const PUT = async (request: NextRequest) => {
  const body = await request.json();

  const result = await updateShipment(body);

  return result.match(
    (res) => NextResponse.json(res, { status: 200 }),
    (err) => {
      switch (err.type) {
        case "DATABASE_ERROR":
        case "DB_SHIPMENTS_UPDATE_ERROR":
          return NextResponse.json(err, { status: 500 });
        default:
          throw new Error(`Unhandled error: ${err.type satisfies never}`);
      }
    },
  );
};
