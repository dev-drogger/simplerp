import { eq, sql, or } from "drizzle-orm";
import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, ok, err } from "neverthrow";
import { GetRevenueError } from "@/types.error";

export const fetchRevenue = (): ResultAsync<
  {
    monthlyRevenue: {
      value: number;
      link: string;
    };
    todayOrders: {
      value: number;
      link: string;
    };
    pendingOrders: {
      value: number;
      link: string;
    };
    pendingShipments: {
      value: number;
      link: string;
    };
  },
  GetRevenueError
> =>
  ResultAsync.fromPromise(
    Promise.all([
      db
        .select({
          monthlyRevenue: sql<number>`
          COALESCE(SUM(${schema.orders.grandTotal}), 0)
        `,
        })
        .from(schema.orders)
        .where(
          sql`${schema.orders.createdAt} >= date_trunc('month', now())
            AND ${schema.orders.createdAt} < now()
            AND ${schema.orders.status} = 'completed'`,
        ),

      db
        .select({
          todayOrders: sql<number>`count(*)`,
        })
        .from(schema.orders)
        .where(
          sql`${schema.orders.createdAt} >= date_trunc('day', now())
        AND ${schema.orders.createdAt} < date_trunc('day', now()) + interval '1 day'`,
        ),
      db
        .select({
          pendingOrders: sql<number>`count(*)`,
        })
        .from(schema.orders)
        .where(eq(schema.orders.status, "pending")),
      db
        .select({
          pendingShipments: sql<number>`count(*)`,
        })
        .from(schema.shipments)
        .where(
          or(
            eq(schema.shipments.shipmentStatus, "pending"),
            eq(schema.shipments.shipmentStatus, "packed"),
          ),
        ),
    ]),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen(([[revenueRow], [countRow], [pendingRow], [shipmentRow]]) => {
    if (!revenueRow || !countRow || !pendingRow || !shipmentRow)
      return err({
        type: "DB_REVENUE_RETRIEVAL_ERROR" as const,
        error: "We couldn't add this customer",
      });

    return ok({
      monthlyRevenue: {
        value: revenueRow.monthlyRevenue,
        link: "/",
      },
      todayOrders: {
        value: countRow.todayOrders,
        link: "/orders",
      },
      pendingOrders: {
        value: pendingRow.pendingOrders,
        link: "/orders",
      },
      pendingShipments: {
        value: shipmentRow.pendingShipments,
        link: "/shipments",
      },
    });
  });
