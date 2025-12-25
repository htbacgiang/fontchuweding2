import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

// Import Reducers
import cartReducers from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import expandSidebar from "./ExpandSlice";
import dialog from "./DialogSlice";
import favoritesReducer from "./favoritesSlice";

// Combine Reducers
const reducers = combineReducers({
  cart: cartReducers,
  wishlist: wishlistReducer,
  expandSidebar,
  dialog,
  favorites: favoritesReducer,
});

// Persist Config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "wishlist", "favorites"], // Thêm favorites vào whitelist để duy trì trạng thái
};

// Persist Reducer
const persistedReducer = persistReducer(persistConfig, reducers);

// Configure Store
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;