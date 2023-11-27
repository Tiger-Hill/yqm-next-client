import { createSlice } from "@reduxjs/toolkit";
import baseEndpointUrl from "../../apiEndpoint";
import Cookies from "js-cookie";

export const initialState = {
  localBasket: typeof window !== "undefined" && JSON.parse(localStorage.getItem("YQM-basket")) || [], // ? ARRAY
  basket: [], // ? ARRAY
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
    },

    addToLocalBasket: (state, action) => {
      if (state.localBasket.find((item) => item.product.slug === action.payload.product.slug)) {
        // We add the quantity of the product to the existing quantity of the product in the basket
        state.localBasket.find((item) => item.product.slug === action.payload.product.slug).quantity += action.payload.quantity;
      } else {
        // We add the product to the basket
        state.localBasket = [...state.localBasket, { quantity: action.payload.quantity, productSlug: action.payload.product.slug }];
      }

      typeof window !== "undefined" && localStorage.setItem("YQM-basket", JSON.stringify(state.localBasket));
    },

    removeFromLocalBasket: (state, action) => {
      state.localBasket = state.localBasket.filter((item) => item.product.slug !== action.payload.product.slug);
      state.basket = state.basket.filter((item) => item.product.slug !== action.payload.product.slug);
      typeof window !== "undefined" && localStorage.setItem("YQM-basket", JSON.stringify(state.localBasket));
    },

    clearFromLocalBasket: (state) => {
      state.localBasket = [];
      state.basket = [];
      typeof window !== "undefined" && localStorage.setItem("YQM-basket", JSON.stringify(state.localBasket));
    }
  },
});

export const getBasketProduct = (productSlug) => {
  return async dispatch => {
    const token = Cookies.get("YQM-token");

    dispatch(
      productSlice.actions.showNotifications({
        status: "pending",
        title: "Sending...",
        message: `Fetching product with slug ${productSlug}. Please wait...`,
      })
    );

    const sendRequest = async () => {
      const res = await fetch(`${baseEndpointUrl}/api/v1/products/${productSlug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`An error occured: Failed to fetch product with slug ${productSlug}...`);
      }

      const data = await res.json();
      return [data, res];
    };

    try {
      const [data, res] = await sendRequest();
      console.log(data);

      if (
        !!res.headers.get("authorization")?.split(" ")[1] === false &&
        !!data.error === true
      ) {
        // ! If we can't split the token string and we have a data.error message, then we throw a new error based on the message returned from backend
        throw new Error(`${data.error}`);
      }

      const product = data.data.attributes

      dispatch(productSlice.actions.setProductToShow({ productToShow: product }));
      dispatch(
        productSlice.actions.showNotifications({
          status: "success",
          title: "Success",
          message: "Successfully fetched product with slug ${productSlug}",
          flash_code: "GET_SHOW_PRODUCT_SUCCESS",
          slice: "product",
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(
        productSlice.actions.showNotifications({
          status: "error",
          title: "Error",
          message: "Failed to fetch product with slug ${productSlug}",
          flash_code: "GET_SHOW_PRODUCT_ERROR",
          slice: "product",
        })
      );
    }
  };
};

export const { showNotifications, flashNotification, addToBasket, removeFromLocalBasket, clearFromLocalBasket } = basketSlice.actions;
export default basketSlice.reducer;
