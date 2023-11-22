import { createSlice } from "@reduxjs/toolkit";
import baseEndpointUrl from "../../apiEndpoint";
import Cookies from "js-cookie";

export const initialState = {
  products: null,
  clientsWishesProducts: null,
  orders: null,
  pricesTableData: null,
  priceToEdit: null,

  notification: {
    status: "success",
    title: "Success",
    message: "Successfully set up the admin slice!",
    flash_code: "GENERAL_SUCCESS",
    slice: "basket",
  }, // ? OBJECT
};

const adminSlice = createSlice({
  name: "admin",
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

    flashNotification: state => {
      console.log("FLASHING NOTIFICATION");
      state.notification = {
        ...state.notification,
        status: "flashed",
      };
    },

    // ! PRODUCTS
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    setClientWishesProducts: (state, action) => {
      state.clientsWishesProducts = action.payload;
    },

    addNewProductToProducts: (state, action) => {
      state.products = [...state.products, action.payload.product];
    },

    updateProductInProducts: (state, action) => {
      // console.log(action.payload.product);
      const updatedProducts = state.products.map(product => {
        if (product.slug === action.payload.product.slug) {
          return action.payload.product;
        } else {
          return product;
        }
      });

      state.products = updatedProducts;
    },

    deleteProductInProducts: (state, action) => {
      // console.log(action.payload.productSlug);
      state.products = state.products.filter(
        product => product.slug !== action.payload.productSlug
      );
    },

    // * Setup the row data for the prices table in the admin dashboard
    setPricesTableData: (state, action) => {
      const pricesTableData = {
        product: action.payload.data.attributes,
        prices: [],
      }

      // ? We extract all the included price and store them in the prices array
      action.payload.included.forEach(instance => {
        instance.type === "price" &&
          pricesTableData.prices.push(instance.attributes);
      });

      // ? We sort the prices array by date
      pricesTableData.prices.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      }).reverse();

      state.pricesTableData = pricesTableData;
    },

    // * Clear the row data for the prices table in the admin dashboard
    clearPricesTableData: (state, action) => {
      state.pricesTableData = null;
    },

    // ! PRICES
    setPriceToEdit: (state, action) => {
      state.priceToEdit = action.payload.data.attributes;
    },

    clearPriceToEdit: (state, action) => {
      state.priceToEdit = null;
    },

    addUnpublishedPriceToProduct: (state, action) => {
      // console.log(action.payload.price);
      const updatedProducts = state.products.map(product => {
        if (product.slug === action.payload.productSlug) {
          return {
            ...product,
            latestUnpublishedPrice: action.payload.price,
          };
        } else {
          return product;
        }
      });

      state.products = updatedProducts;
    },

    publishAllSelectedProductPrices: (state) => {
      state.pricesTableData.prices =  state.pricesTableData.prices.map(price => {
        return { ...price, published: true };
      })
    },

    // ! ORDERS
    setAdminOrders: (state, action) => {
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

    updateOrderStatus: (state, action) => {
      // console.log(action.payload.orderSlug);
      const updatedOrders = state.orders.map(order => {
        if (order.slug === action.payload.orderSlug) {
          return {
            ...order,
            orderStatus: action.payload.newStatus,
          };
        } else {
          return order;
        }
      });

      state.orders = updatedOrders;
    }
  },
});

// ! GET ALL PRODUCTS
export const getAdminProducts = () => {
  console.log("HEY THERE");

  return async (dispatch) => {
    const token = Cookies.get("YQM-token");

    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Fetching all products. Please wait...` }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/products`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
        );

        if (!res.ok) {
          throw new Error(`An error occured: Failed to fetch admin products...`);
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


      const products = []
      data.data.map((product) => products.push(product.attributes))

      dispatch(adminSlice.actions.setProducts(products));
      dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: "Successfully fetched all products", flash_code: "GET_ALL_ADMIN_PRODUCTS_SUCCESS", slice: "admin", }));
    } catch (error) {
      console.error(error);
      dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "GET_ALL_ADMIN_PRODUCTS_ERROR", slice: "admin", }));
    }
  };
};

// ! GET CLIENT WISH PRODUCTS
export const getClientWishesProducts = () => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");

    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Fetching all products with status "client wish". Please wait...` }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/products/client_wishes_products`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

        if (!res.ok) {
          throw new Error(`An error occured: Failed to fetch admin products with status "client wish"...`);
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

      const products = []
      data.data.map((product) => products.push(product.attributes))

      dispatch(adminSlice.actions.setClientWishesProducts(products));
      dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: "Successfully fetched all products with status 'client wish'", flash_code: "GET_ALL_CLIENT_WISHES_PRODUCTS_SUCCESS", slice: "admin" }));
    } catch (error) {
      console.error(error);
      dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "GET_ALL_CLIENT_WISHES_PRODUCTS_ERROR", slice: "admin" }));
    }
  };
};

// ! CREATE PRODUCT
export const createProduct = (product) => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");
    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Starting to create new product...`, }));

    // ? WE USE FORM DATA TO SEND FILES. THE ACCEPTED VALUES ARE STRINGS AND BLOBS
    // ? THIS IS APPARENTLY THE EASIEST WAY TO SEND FILES FROM CLIENT TO SERVER SIDE
    // * EXPLANATION ABOUT HOW STRONG PARAMS WORK WITH FORM DATA -->
    // * https://medium.com/@jugtuttle/formdata-and-strong-params-ruby-on-rails-react-c230d050e26e

    const formData = new FormData();
    for (const property in product) {
      formData.append(`product[${property}]`, product[property]);
    }

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/products`,
        {
          method: "POST",
          headers: {
            // ! CONTENT TYPE NOT NEEDED IN CASE WE SEND A FORM DATA
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to create new product...`);
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

        dispatch(adminSlice.actions.addNewProductToProducts({ product: data.data[0].attributes }));
        dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: `Sucessfully created new product`, flash_code: "CREATE_PRODUCT_SUCCESS", slice: "admin" }));
      } catch (error) {
        dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "CREATE_PRODUCT_ERROR", slice: "admin" }));
    }
  };
};

// ! UPDATE PRODUCT
export const updateProduct = (productData, productSlug) => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");
    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Starting to update product with slug ${productSlug}...`, }));

    // ? WE USE FORM DATA TO SEND FILES. THE ACCEPTED VALUES ARE STRINGS AND BLOBS
    // ? THIS IS APPARENTLY THE EASIEST WAY TO SEND FILES FROM CLIENT TO SERVER SIDE
    // * EXPLANATION ABOUT HOW STRONG PARAMS WORK WITH FORM DATA -->
    // * https://medium.com/@jugtuttle/formdata-and-strong-params-ruby-on-rails-react-c230d050e26e

    const formData = new FormData();
    for (const property in productData) {
      formData.append(`product[${property}]`, productData[property]);
    }

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/products/${productSlug}`,
        {
          method: "PATCH",
          headers: {
            // ! CONTENT TYPE NOT NEEDED IN CASE WE SEND A FORM DATA
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to update product with slug ${productSlug}...`);
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

        dispatch(adminSlice.actions.updateProductInProducts({ product: data.data.attributes }));
        dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: `Sucessfully updated product with slug ${productSlug}`, flash_code: "UPDATE_PRODUCT_SUCCESS", slice: "admin" }));
      } catch (error) {
        dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "UPDATE_PRODUCT_ERROR", slice: "admin" }));
    }
  };
};

// ! DELETE PRODUCT
export const deleteProduct = (productSlug) => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");
    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Starting to delete product with slug ${productSlug}...`, }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/products/${productSlug}`,
        {
          method: "DELETE",
          headers: {
            // ! CONTENT TYPE NOT NEEDED IN CASE WE SEND A FORM DATA
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // body: { product: { slug: productSlug } }
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to delete product with slug ${productSlug}...`);
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

        dispatch(adminSlice.actions.deleteProductInProducts({ productSlug: productSlug }));
        dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: `Sucessfully deleted product with slug ${productSlug}`, flash_code: "DELETE_PRODUCT_SUCCESS", slice: "admin" }));
      } catch (error) {
        dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "DELETE_PRODUCT_ERROR", slice: "admin" }));
    }
  };
};

// ! GET ALL PRODUCT PRICES
export const getAllProductPrices = (productSlug) => {
  console.log("HEY THERE");

  return async (dispatch) => {
    const token = Cookies.get("YQM-token");

    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Fetching all prices for product with slug ${productSlug}. Please wait...` }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/products/${productSlug}/prices`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
        );

        if (!res.ok) {
          throw new Error(`An error occured: Failed to fetch admin prices for product ${productSlug}...`);
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


      // data.data.map((product) => products.push(product.attributes))

      dispatch(adminSlice.actions.setPricesTableData(data));
      dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: `Successfully fetched all prices for product ${productSlug}`, flash_code: "GET_ALL_ADMIN_PRODUCT_PRICE_SUCCESS", slice: "admin", }));
    } catch (error) {
      console.error(error);
      dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "GET_ALL_ADMIN_PRODUCT_PRICE_ERROR", slice: "admin", }));
    }
  };
};

// !############################################################################
// !############################################################################
// ! PRICES
export const getPrice = (priceSlug) => {
  console.log("HEY THERE");

  return async (dispatch) => {
    const token = Cookies.get("YQM-token");

    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Fetching price with slug ${priceSlug}. Please wait...` }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/prices/${priceSlug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

        if (!res.ok) {
          throw new Error(`An error occured: Failed to fetch price with slug${priceSlug}...`);
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

      dispatch(adminSlice.actions.setPriceToEdit(data));
      dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: `Successfully fetched price with slug ${priceSlug}`, flash_code: "GET_ADMIN_PRICE_SUCCESS", slice: "admin", }));
    } catch (error) {
      console.error(error);
      dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "GET_ADMIN_PRICE_ERROR", slice: "admin", }));
    }
  };
};


// ! CREATE PRICE
export const createPrice = (price) => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");
    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Starting to create new price for product with slug ${price.productId}...`, }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/prices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ price: price })
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to create new price for product with slug ${price.productId}...`);
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

      dispatch(adminSlice.actions.addUnpublishedPriceToProduct({ price: data.data[0].attributes.basePrice, productSlug: price.productId }));
      dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: `Sucessfully created new price for product with slug ${price.productId}`, flash_code: "CREATE_PRICE_SUCCESS", slice: "admin" }));
    } catch (error) {
      dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "CREATE_PRICE_ERROR", slice: "admin" }));
    }
  };
};

// ! UPDATE PRICE
export const updatePrice = (price) => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");
    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Starting to update price with slug ${price.slug}...`, }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/prices/${price.slug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ price: price })
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to update price with slug ${price.slug}...`);
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

      dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: `Sucessfully updated price with slug ${price.slug}`, flash_code: "UPDATE_PRICE_SUCCESS", slice: "admin" }));
    } catch (error) {
      dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "UPDATE_PRICE_ERROR", slice: "admin" }));
    }
  };
};

// ! UPDATE PRICE
export const deletePrice = (priceSlug) => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");
    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Starting to delete price with slug ${priceSlug}...`, }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/prices/${priceSlug}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to delete price with slug ${priceSlug}...`);
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

      dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: `Sucessfully deleted price with slug ${priceSlug}`, flash_code: "DELETE_PRICE_SUCCESS", slice: "admin" }));
    } catch (error) {
      dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "DELETE_PRICE_ERROR", slice: "admin" }));
    }
  };
};

// ! PUBLISH ALL PRICES
export const publishAllPrices = () => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");
    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Starting to publish all prices...`, }));

    const sendRequest = async () => {
      const res = await fetch(`${baseEndpointUrl}/api/v1/prices/publish_all`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify({ order: { status: "completed" } })
      });

      if (!res.ok) {
        throw new Error(`An error occured: Failed to publish all prices...`);
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

        dispatch(adminSlice.actions.publishAllSelectedProductPrices());
        dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: `Sucessfully published all prices`, flash_code: "PUBLISH_ALL_PRICES_SUCCESS", slice: "admin" }));
      } catch (error) {
        dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "PUBLISH_ALL_PRICES_ERROR", slice: "admin" }));
    }
  };
};

// ! ORDERS
// ! GET ALL PRODUCTS
export const getAdminOrders = () => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");

    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Fetching all admin orders. Please wait...` }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/orders`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
        );

        if (!res.ok) {
          throw new Error(`An error occured: Failed to fetch admin orders...`);
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

      // const orders = []
      // data.data.map(product => orders.push(product.attributes));

      dispatch(adminSlice.actions.setAdminOrders(data));
      dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: "Successfully fetched all admin orders", flash_code: "GET_ALL_ADMIN_ORDERS_SUCCESS", slice: "admin", }));
    } catch (error) {
      console.error(error);
      dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "GET_ALL_ADMIN_ORDERS_ERROR", slice: "admin", }));
    }
  };
};

// ! MARK AS COMPLETE
export const markOrderAsCompleted = (orderSlug) => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");
    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Starting to mark ${orderSlug} as complete...`, }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/orders/${orderSlug}/mark_as_completed`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // body: JSON.stringify({ order: { status: "completed" } })
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to mark ${orderSlug} as completed...`);
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

        dispatch(adminSlice.actions.updateOrderStatus({ orderSlug: orderSlug, newStatus: "Completed" }));
        dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: `Sucessfully marked ${orderSlug} as completed`, flash_code: "MARK_ORDER_COMPLETED_SUCCESS", slice: "admin" }));
      } catch (error) {
        dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "MARK_ORDER_COMPLETED_ERROR", slice: "admin" }));
    }
  };
};

// ! MARK AS CANCELLED
export const markOrderAsCancelled = (orderSlug) => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");
    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Starting to mark ${orderSlug} as cancelled...`, }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/orders/${orderSlug}/mark_as_cancelled`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // body: JSON.stringify({ order: { status: "completed" } })
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to mark ${orderSlug} as cancelled...`);
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

        dispatch(adminSlice.actions.updateOrderStatus({ orderSlug: orderSlug, newStatus: "Cancelled" }));
        dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: `Sucessfully marked ${orderSlug} as cancelled`, flash_code: "MARK_ORDER_CANCELLED_SUCCESS", slice: "admin" }));
      } catch (error) {
        dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "MARK_ORDER_CANCELLED_ERROR", slice: "admin" }));
    }
  };
};

export const {
  showNotifications,
  flashNotification,
  setAdminProducts,
  clearPricesTableData,
  clearPriceToEdit,
} = adminSlice.actions;
export default adminSlice.reducer;
