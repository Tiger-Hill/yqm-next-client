import { createSlice } from "@reduxjs/toolkit";
import baseEndpointUrl from "../../apiEndpoint";
import Cookies from "js-cookie";

export const initialState = {
  productsToWish: null,
  maxNumberOfForWishingProducts: null,
  productsToOrder: null,
  maxNumberOfForOrderingProducts: null,
  notification: {
    status: "success",
    title: "Success",
    message: "Successfully set up the product slice!",
    flash_code: "GENERAL_SUCCESS",
    slice: "product",
  }, // ? OBJECT
};

const productSlice = createSlice({
  name: "product",
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

    setProductsToWish: (state, action) => {
      state.productsToWish = action.payload.products;
      state.maxNumberOfForWishingProducts = action.payload.maxNumberOfForWishingProducts;
    },

    setProductsToOrder: (state, action) => {
      state.productsToOrder = action.payload.products;
      state.maxNumberOfForOrderingProducts = action.payload.maxNumberOfForOrderingProducts;
    }
  },
});

export const getForWishingProducts = (pageNumber, searchInputValue = "") => {
  return async dispatch => {
    const token = Cookies.get("YQM-token");

    dispatch(
      productSlice.actions.showNotifications({
        status: "pending",
        title: "Sending...",
        message: `Fetching all for wishing products. Please wait...`,
      })
    );

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/products/for_wishing?page=${pageNumber}&search=${searchInputValue}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to fetch for wishing products...`);
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

      const products = [];
      data.data.map(product => products.push(product.attributes));

      dispatch(productSlice.actions.setProductsToWish({ products: products, maxNumberOfForWishingProducts: data.meta.max_number_of_for_wishing_products }));
      dispatch(
        productSlice.actions.showNotifications({
          status: "success",
          title: "Success",
          message: "Successfully fetched all for wishing products",
          flash_code: "GET_ALL_FOR_WISHING_PRODUCTS_SUCCESS",
          slice: "product",
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(
        productSlice.actions.showNotifications({
          status: "error",
          title: "Error",
          message: "Failed to fetch all products",
          flash_code: "GET_ALL_FOR_WISHING_PRODUCTS_ERROR",
          slice: "product",
        })
      );
    }
  };
};

export const getForOrderingProducts = (pageNumber, searchInputValue = "") => {
  return async dispatch => {
    const token = Cookies.get("YQM-token");

    dispatch(
      productSlice.actions.showNotifications({
        status: "pending",
        title: "Sending...",
        message: `Fetching all for ordering products. Please wait...`,
      })
    );

    const sendRequest = async () => {
      const res = await fetch(`${baseEndpointUrl}/api/v1/products/for_ordering?page=${pageNumber}&search=${searchInputValue}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`An error occured: Failed to fetch for ordering products...`);
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

      const products = [];
      data.data.map(product => products.push(product.attributes));

      dispatch(productSlice.actions.setProductsToOrder({ products: products, maxNumberOfForOrderingProducts: data.meta.max_number_of_for_ordering_products }));
      dispatch(
        productSlice.actions.showNotifications({
          status: "success",
          title: "Success",
          message: "Successfully fetched all for ordering products",
          flash_code: "GET_ALL_FOR_ORDERING_PRODUCTS_SUCCESS",
          slice: "product",
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(
        productSlice.actions.showNotifications({
          status: "error",
          title: "Error",
          message: "Failed to fetch all products",
          flash_code: "GET_ALL_FOR_ORDERING_PRODUCTS_ERROR",
          slice: "product",
        })
      );
    }
  };
};


// export const getProducts = () => {
//   console.log("HEY THERE");

//   return async (dispatch) => {
//     const token = Cookies.get("YQM-token");
//     // console.log(token);
//     // const userDetailsSlugReference = Cookies.get("YQM-userDetailsSlug");

//     dispatch(productSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Fetching all products. Please wait...` }));

//     const sendRequest = async () => {
//       const res = await fetch(
//         `${baseEndpointUrl}/api/v1/products/overview`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             // Authorization: `Bearer ${token}`,
//           },
//         }
//         );

//         if (!res.ok) {
//           throw new Error(`An error occured: Failed to fetch products...`);
//         }

//         const data = await res.json();
//         return [data, res];
//       };

//       try {
//         const [data, res] = await sendRequest();
//         console.log(data);

//       if ((!!res.headers.get("authorization")?.split(" ")[1] === false) && (!!data.error === true)) {
//         // ! If we can't split the token string and we have a data.error message, then we throw a new error based on the message returned from backend
//         throw new Error(`${data.error}`);
//       }


//       const products = []
//       data.data.map((product) => products.push(product.attributes))

//       dispatch(productSlice.actions.setProducts(products));
//       dispatch(productSlice.actions.showNotifications({ status: "success", title: "Success", message: "Successfully fetched all products", flash_code: "GET_ALL_PRODUCTS_SUCCESS", slice: "product", }));
//     } catch (error) {
//       console.error(error);
//       dispatch(productSlice.actions.showNotifications({ status: "error", title: "Error", message: "Failed to fetch all products", flash_code: "GET_ALL_PRODUCTS_ERROR", slice: "product", }));
//     }
//   };
// };

export const { showNotifications, flashNotification, setProducts } = productSlice.actions;
export default productSlice.reducer;
