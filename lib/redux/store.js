import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/lib/redux/slices/authSlice";
import productReducer from "@/lib/redux/slices/productSlice";
import userDetailReducer from "@/lib/redux/slices/userDetailSlice";
import orderReducer from "@/lib/redux/slices/orderSlice";
import passwordReducer from "@/lib/redux/slices/passwordSlice";
import basketReducer from "@/lib/redux/slices/basketSlice";
import transactionReducer from "@/lib/redux/slices/transactionSlice";
import adminReducer from "@/lib/redux/slices/adminSlice";
// import temeReducer from "@/lib/redux/slices/themeSlice";

const combinedReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  userDetail: userDetailReducer,
  order: orderReducer,
  password: passwordReducer,
  basket: basketReducer,
  transaction: transactionReducer,
  admin: adminReducer,
  // theme: temeReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/destroySession") {
    state = undefined;
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: {
    rootReducer,
  },
});

export default store;
