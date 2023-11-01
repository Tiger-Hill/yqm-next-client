import { createSlice } from "@reduxjs/toolkit";
import baseEndpointUrl from "../../apiEndpoint";
import Cookies from "js-cookie";

export const initialState = {
  basket: typeof window !== "undefined" && JSON.parse(localStorage.getItem("basket")) || [], // ? ARRAY
  notification: {
    status: "success",
    title: "Success",
    message: "Successfully set up the basket slice!",
    flash_code: "GENERAL_SUCCESS",
    slice: "basket",
  }, // ? OBJECT
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    showNotifications: (state, action) => {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
        flash_code: action.payload.flash_code,
        slice: action.payload.slice,
      };
    },

    flashNotification: (state) => {
      state.notification = {
        ...state.notification,
        status: "flashed",
      };
    },

    addToBasket: (state, action) => {
      if (state.basket.find((item) => item.product.slug === action.payload.product.slug)) {
        // We add the quantity of the product to the existing quantity of the product in the basket
        state.basket.find((item) => item.product.slug === action.payload.product.slug).quantity += action.payload.quantity;
      } else {
        // We add the product to the basket
        state.basket = [...state.basket, { quantity: action.payload.quantity, product: action.payload.product }];
      }

      typeof window !== "undefined" && localStorage.setItem("basket", JSON.stringify(state.basket));
    },

    removeFromBasket: (state, action) => {
      state.basket = state.basket.filter((item) => item.product.slug !== action.payload.product.slug);
      typeof window !== "undefined" && localStorage.setItem("basket", JSON.stringify(state.basket));
    },

    clearBasket: (state) => {
      state.basket = [];
      typeof window !== "undefined" && localStorage.setItem("basket", JSON.stringify(state.basket));
    }
  },
});

export const { showNotifications, flashNotification, addToBasket, removeFromBasket, clearBasket } = basketSlice.actions;
export default basketSlice.reducer;
