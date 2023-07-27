import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import clientReducer from "../features/client/clientSlice";
import { emptySplitApi } from "../services/emptySplit";
import { setupListeners } from "@reduxjs/toolkit/query";

const reducers = combineReducers({
  auth: authReducer,
  client: clientReducer,
  [emptySplitApi.reducerPath]: emptySplitApi.reducer,
});

export const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(emptySplitApi.middleware),
});

setupListeners(store.dispatch);
