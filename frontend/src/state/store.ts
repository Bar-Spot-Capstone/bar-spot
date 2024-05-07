import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import groupReducer from "./slices/groupSlice";
import mapReducer from "./slices/mapSlice";
import chainReducer from "./slices/barHopSlice";

export const store = configureStore({
  reducer: { user: userReducer, group: groupReducer, map: mapReducer, barChain: chainReducer },

  //The reason for the following settings
  //https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
