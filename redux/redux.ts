import { configureStore } from "@reduxjs/toolkit";
import { databaseApi } from "@/services/database";
import { setupListeners } from "@reduxjs/toolkit/query";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";

const appReducer = combineReducers({
  [databaseApi.reducerPath]: databaseApi.reducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any,
) => {
  if (action.type === "RESET_ALL") {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(databaseApi.middleware),
});

setupListeners(store.dispatch);

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
