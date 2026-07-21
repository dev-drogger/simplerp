import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import { SerializedError } from "@reduxjs/toolkit";

const DEFAULT_DESCRIPTION = "Please try again later";

export const handleErrorToast = <T extends { type: string; error: string }>(
  errorValue: FetchBaseQueryError | SerializedError | undefined,
): boolean => {
  if (!errorValue) return false;

  if ("status" in errorValue) {
    if ("error" in errorValue) {
      toast.error(errorValue.error, {
        description: DEFAULT_DESCRIPTION,
      });
      return true;
    }

    const err = errorValue.data as T;

    toast.error(err.error, {
      description: DEFAULT_DESCRIPTION,
    });
    return true;
  } else {
    toast.error(errorValue.message, {
      description: DEFAULT_DESCRIPTION,
    });
    return true;
  }
};
