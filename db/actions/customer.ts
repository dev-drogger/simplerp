import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { ResultAsync, ok, err } from "neverthrow";
import { CreateCustomerError } from "@/types.error";
import { Customer } from "@/types";

export const insertCustomer = (
  customer: Customer,
): ResultAsync<{ ok: boolean; message: string }, CreateCustomerError> =>
  ResultAsync.fromPromise(
    db.insert(schema.customers).values(customer).returning(),
    () => ({
      type: "DATABASE_ERROR" as const,
      error: "Unexpected error",
    }),
  ).andThen((rows) => {
    const [customer] = rows;
    if (!customer)
      return err({
        type: "DB_CUSTOMER_CREATION_ERROR" as const,
        error: "We couldn't add this customer",
      });
    return ok({ ok: true, message: "created" });
  });
