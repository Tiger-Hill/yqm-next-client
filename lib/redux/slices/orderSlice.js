import { createSlice } from "@reduxjs/toolkit";
import baseEndpointUrl from "../../apiEndpoint";
import Cookies from "js-cookie";

export const initialState = {
  orders: null,
  notification: {
    status: "success",
    title: "Success",
    message: "Successfully set up the order slice!",
    flash_code: "GENERAL_SUCCESS",
    slice: "order",
  }, // ? OBJECT
};

const orderSlice = createSlice({
  name: "order",
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

    flashOrderCreatePaypalErrorNotification: (state) => {
      state.notification = {
        slice: "order", status: "error", title: "Error", message: "An error occured with your payment. Please try again (onApprove Error - Paypal)", flash_code: "ORDER_CREATE_ERROR"
      }
    },

    flashOrderCreateStripeErrorNotification: (state) => {
      state.notification = {
        slice: "order", status: "error", title: "Error", message: "An error occured with your payment. Please try again (onApprove - Stripe)", flash_code: "ORDER_CREATE_ERROR"
      }
    },


    setOrders: (state, action) => {
      // * We initialize an empty array to store the orders
      const orders = [];

      // * We store the included data in a variable to make it easier to work with
      const includedData = action.payload.included;

      // * We loop through the data array to get the details of the orders
      action.payload.data.forEach(order => {
        const orderProductIds = order.relationships.orderProducts.data.map(orderProduct => orderProduct.id);

        const orderData = {
          // * We construct the content of the order object withthe details of the order
          ...order.attributes,

          // * We loop through the orderProductIds array to get the details of the products for the order
          orderProducts: orderProductIds.map(orderProductId => {
            const productId = includedData.find(instance => instance.type === "orderProduct" && instance.id === orderProductId).relationships.product.data.id;

            // * We construct the content of the orderProducts array by including:
            // *    - the detail of the products for the order
            // *    - the details of the product itself
            return {
              orderProduct: includedData.find(instance => instance.type === "orderProduct" && instance.id === orderProductId).attributes,
              product: includedData.find(instance => instance.type === "product" && instance.id === productId).attributes
            };
          }),
        };

        // * We push the constructed object to our order array
        orders.push(orderData);
      });

      state.orders = orders;
    },

    addBuyOrderToOrders: (state, action) => {
      // * We store the included data in a variable to make it easier to work with
      const includedData = action.payload.included;
      const orderProductIds = action.payload.data.relationships.orderProducts.data.map(orderProduct => orderProduct.id);

      const buyOrder = {
        ...action.payload.data.attributes,

        orderProducts: orderProductIds.map(orderProductId => {
          const productId = includedData.find(instance => instance.type === "orderProduct" && instance.id === orderProductId).relationships.product.data.id;

          // * We construct the content of the orderProducts array by including:
          // *    - the detail of the products for the order
          // *    - the details of the product itself
          return {
            orderProduct: includedData.find(instance => instance.type === "orderProduct" && instance.id === orderProductId).attributes,
            product: includedData.find(instance => instance.type === "product" && instance.id === productId).attributes
          };
        }),
      };

      state.orders = state.orders === null ? [buyOrder] : [...state.orders, buyOrder];
    },

    addSellOrderToOrders: (state, action) => {
      // * We store the included data in a variable to make it easier to work with
      const includedData = action.payload.included;

      const sellOrderObject = {
        ...action.payload.data.attributes,

        orderProducts: [
          {
            orderProduct: includedData.find(instance => instance.type === "orderProduct").attributes,
            product: includedData.find(instance => instance.type === "product").attributes
          }
        ]
      };

      state.orders = state.orders === null ? [sellOrderObject] : [...state.orders, sellOrderObject];
    },

  },
});


// * CREATE ORDER
export const createOrder = (order) => {
  console.log(order);

  return async (dispatch) => {
    const token = Cookies.get("YQM-token");
    const userDetailsSlug = Cookies.get("YQM-userDetailsSlug");

    dispatch(orderSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Starting to create an order for user detail with slug ${userDetailsSlug}...`, }));

    const sendRequest = async () => {
      const res = await fetch(`${baseEndpointUrl}/api/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderProducts: order.orderProducts,
          order: order.orderDetails,
        }),
      });

      if (!res.ok) {
        throw new Error(`An error occured: Failed to create the order for user details with slug ${userDetailsSlug}...`);
      }

      const data = await res.json();
      return [data, res];
    };

    try {
      const [data, res] = await sendRequest();
      console.log(data);

      if ((!!res.headers.get("authorization")?.split(" ")[1] === false) && (!!data.error === true)) {
        // ! If we can't split the token string and we have a data.error message, then we throw a new error based on the message returned from backend
        throw new Error(`${data.error}`);
      }

        dispatch(orderSlice.actions.addBuyOrderToOrders(data));
        dispatch(orderSlice.actions.showNotifications({ status: "success", title: "Success", message: `Sucessfully created order for user details with slug: ${userDetailsSlug}`, flash_code: "ORDER_CREATE_SUCCESS", slice: "order" }));
        // dispatch(orderSlice.actions.showNotifications({ ...userDetailsInitialState, status: "success", title: "Success", message: `Sucessfully created order for user details with slug: ${userDetailsSlug}`, flash_code: "ORDER_CREATE_SUCCESS" }));
      } catch (error) {
        dispatch(orderSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "ORDER_CREATE_ERROR", slice: "order" }));
        // dispatch(orderSlice.actions.showNotifications({ ...userDetailsInitialState, status: "error", title: "Error", message: error.message, flash_code: "ORDER_CREATE_ERROR" }));
    }
  };
};

export const createSellingOrder = (order) => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");
    const userDetailsSlug = Cookies.get("YQM-userDetailsSlug");

    dispatch(orderSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Starting to create a selling order for user detail with slug ${userDetailsSlug}...`, }));
    // dispatch(orderSlice.actions.showNotifications({ ...userDetailsInitialState, status: "pending", title: "Sending...", message: `Starting to create a selling order for user detail with slug ${userDetailsSlug}...`, }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderProducts: { productId: [order.productId], orderQuantity: [order.orderQuantity] },
            order: {
              orderCurrency: order.orderCurrency,
              orderType: order.orderType,
            }
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to create the selling order for user details with slug ${userDetailsSlug}...`);
      }

      const data = await res.json();
      return [data, res];
    };

    try {
      const [data, res] = await sendRequest();
      console.log(data);

      if ((!!res.headers.get("authorization")?.split(" ")[1] === false) && (!!data.error === true)) {
        // ! If we can't split the token string and we have a data.error message, then we throw a new error based on the message returned from backend
        throw new Error(`${data.error}`);
      }

      dispatch(orderSlice.actions.addSellOrderToOrders(data));
      dispatch(orderSlice.actions.showNotifications({ status: "success", title: "Success", message: `Sucessfully created selling order for user details with slug: ${userDetailsSlug}`, flash_code: "SELLING_ORDER_CREATE_SUCCESS", slice: "order" }));
      // dispatch(orderSlice.actions.showNotifications({ ...userDetailsInitialState, status: "success", title: "Success", message: `Sucessfully created selling order for user details with slug: ${userDetailsSlug}`, flash_code: "SELLING_ORDER_CREATE_SUCCESS" }));
    } catch (error) {
      dispatch(orderSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "SELLING_ORDER_CREATE_ERROR", slice: "order" }));
    }
  };
};


// * GET ALL ORDERS
export const getAllOrders = () => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");

    dispatch(orderSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: "Starting to fetch all orders...", }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/orders/overview`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("An error occured: Failed to fetch all orders...");
      }

      const data = await res.json();
      return [data, res];
    };

    try {
      const [data, res] = await sendRequest();
      console.log(data);

      if ((!!res.headers.get("authorization")?.split(" ")[1] === false) && (!!data.error === true)) {
        // ! If we can't split the token string and we have a data.error message, then we throw a new error based on the message returned from backend
        throw new Error(`${data.error}`);
      }

      dispatch(orderSlice.actions.setOrders(data));
      dispatch(orderSlice.actions.showNotifications({ status: "success", title: "Success", message: "Sucessfully fetched all orders", flash_code: "GET_ALL_ORDERS_SUCCESS" }));
    } catch (error) {
      dispatch(orderSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "GET_ALL_ORDERS_ERROR" }));
    }
  };
};

export const {
  showNotifications,
  flashNotification,
  flashOrderCreatePaypalErrorNotification,
  setOrders,
  flashOrderCreateStripeSuccessNotification,
} = orderSlice.actions;
export default orderSlice.reducer;
