import { configureStore } from "@reduxjs/toolkit";
import { useDispatch,useSelector,TypedUseSelectorHook } from "react-redux";
import themeReducer from "./features/theme/theme-slice";
import coingeckoReducer from "./features/coingecko/coingecko-slice";
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    coingecko: coingeckoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

