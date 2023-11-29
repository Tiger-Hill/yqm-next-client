import { createSlice } from "@reduxjs/toolkit";
import baseEndpointUrl from "../../apiEndpoint";
import Cookies from "js-cookie";

export const initialState = {
  products: null,
  clientsWishesProducts: null,
  orders: null,
  pricesTableData: null,
  priceToEdit: null,

  ordersRowsToUpdate: null,
  orderRowsAreValid: null,

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

    updateProduct: (state, action) => {
      if (action.payload.product.productStatus === "client wish") {
        state.clientsWishesProducts = state.clientsWishesProducts.map(product => {
          if (product.slug === action.payload.product.slug) {
            return action.payload.product;
          } else {
            return product;
          }
        });

        if (state.clientsWishesProducts.includes(action.payload.product) === false) {
          state.clientsWishesProducts = [...state.clientsWishesProducts, action.payload.product];
        };

        // ! We also update the product in the products array
        state.products = state.products.filter(product => product.slug !== action.payload.product.slug);
      } else {
        state.products = state.products.map(product => {
          if (product.slug === action.payload.product.slug) {
            return action.payload.product;
          } else {
            return product;
          }
        });

        if (state.products.includes(action.payload.product) === false) {
          state.products = [...state.products, action.payload.product];
        };

        // ! We also update the product in the clientsWishesProducts array
        state.clientsWishesProducts = state.clientsWishesProducts.filter(product => product.slug !== action.payload.product.slug);
      }
    },

    deleteProductInProducts: (state, action) => {
      // * We delete the product from the products array OR from the clientsWishesProducts array
      state.products = state.products.filter(
        product => product.slug !== action.payload.productSlug
      );

      state.clientsWishesProducts = state.clientsWishesProducts.filter(
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

    updateAllProductsPrices: (state) => {
      const updatedProducts = state.products.map(product => {
        if (product.latestUnpublishedPrice) {
          return {
            ...product,
            latestPrice: product.latestUnpublishedPrice,
            latestUnpublishedPrice: null,
          };
        } else {
          return product;
        }
      });

      state.products = updatedProducts;
    },


    // ! ORDERS
    setAdminOrders: (state, action) => {
      // * We store the included data in a variable to make it easier to work with
      const includedData = action.payload.included;

      // * We initialize an empty array to store the orders
      const orders = action.payload.data.map(order => {
        return ({
          ...order.attributes,
          product: includedData.find(instance => instance.type === "product" && instance.id === order.relationships.product.data.id).attributes,
        })
      })

      // * We group the orders by their reference number
      const groupedOrders = Object.groupBy(orders, order => order.orderReferenceNumber);

      // * We convert the groupedOrders object into an array
      const groupedOrdersArray = Object.entries(groupedOrders).map(
        ([referenceNumber, orders]) => ({
          referenceNumber,
          orders,
        })
      );

      state.orders = groupedOrdersArray;
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
    },

    // ! CHECK CSV FILE WITH ORDERS TO UPDATE
    setOrderRowsToUpdateFromCsvFileContent: (state, action) => {
      state.ordersRowsToUpdate = action.payload.orderRows;
      state.orderRowsAreValid = action.payload.isValid;
    },

    resetOrderRowsToUpdate: (state, action) => {
      state.ordersRowsToUpdate = null;
      state.orderRowsAreValid = null;
    },
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
export const createProduct = (productData) => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");

    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Starting to create new product...`, }));

    // ? WE USE FORM DATA TO SEND FILES. THE ACCEPTED VALUES ARE STRINGS AND BLOBS
    // ? THIS IS APPARENTLY THE EASIEST WAY TO SEND FILES FROM CLIENT TO SERVER SIDE
    // * EXPLANATION ABOUT HOW STRONG PARAMS WORK WITH FORM DATA -->
    // * https://medium.com/@jugtuttle/formdata-and-strong-params-ruby-on-rails-react-c230d050e26e

    const formData = new FormData();
    for (const property in productData) {
      if (productData[property] instanceof Array) {

        console.log(productData[property]);
        for (let i = 0; i < productData[property].length; i++) {
          formData.append(`product[${property}][]`, productData[property][i]);
        }
      } else {
        formData.append(`product[${property}]`, productData[property]);
      }
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
      if (productData[property] instanceof Array) {

        console.log(productData[property]);
        for (let i = 0; i < productData[property].length; i++) {
          formData.append(`product[${property}][]`, productData[property][i]);
        }
      } else {
        formData.append(`product[${property}]`, productData[property]);
      }
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

        dispatch(adminSlice.actions.updateProduct({ product: data.data.attributes }));
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
        dispatch(adminSlice.actions.updateAllProductsPrices());
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

      const orderReferenceNumber = data.data.attributes.orderReferenceNumber;s

      dispatch(adminSlice.actions.updateOrderStatus({ referenceNumber: orderReferenceNumber, orderSlug: orderSlug, newStatus: "Cancelled" }));
      dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: `Sucessfully marked ${orderSlug} as cancelled`, flash_code: "MARK_ORDER_CANCELLED_SUCCESS", slice: "admin" }));
    } catch (error) {
      dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "MARK_ORDER_CANCELLED_ERROR", slice: "admin" }));
    }
  };
};

export const getAllOrdersCsv = () => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");

    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Generating CSV with all orders. Please wait...` }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/products/all_order_csv`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

        if (!res.ok) {
          throw new Error(`An error occured: Failed to generate CSV with all orders...`);
        }

        const data = await res.text();
        return [data, res];
      };

      try {
        const [data, res] = await sendRequest();
        console.log(data);

      if ((!!res.headers.get("authorization")?.split(" ")[1] === false) && (!!data.error === true)) {
        // ! If we can't split the token string and we have a data.error message, then we throw a new error based on the message returned from backend
        throw new Error(`${data.error}`);
      }

      // * Create a blob from the data
      const blob = new Blob([data], { type: 'text/csv' });

      // * Create a data URL for the blob
      const dataUrl = window.URL.createObjectURL(blob);

      // * Create an anchor element
      const a = document.createElement('a');
      a.href = dataUrl;

      // * Set the download attribute and filename
      a.download = `${new Date().toISOString()}___all_orders_for_product.csv`;

      // * Append the anchor to the document
      document.body.appendChild(a);

      // * Programmatically click on the anchor to trigger the download
      a.click();

      // * Remove the anchor from the document
      document.body.removeChild(a);

      // * Release the blob URL
      window.URL.revokeObjectURL(dataUrl);

      dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: "Successfully fetched CSV file containing all orders", flash_code: "GET_ALL_ORDERS_CSV_ADMIN_SUCCESS", slice: "admin", }));
    } catch (error) {
      console.error(error);
      dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "GET_ALL_ORDERS_CSV_ADMIN_ERROR", slice: "admin", }));
    }
  };
};

export const getAllOrdersCsvForProduct = (productSlug) => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");

    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Generating CSV with all orders for product with slug ${productSlug}. Please wait...` }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/products/${productSlug}/order_csv`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

        if (!res.ok) {
          throw new Error(`An error occured: Failed to generate CSV with all orders for product with slug ${productSlug}...`);
        }

        const data = await res.text();
        return [data, res];
      };

      try {
        const [data, res] = await sendRequest();
        console.log(data);

      if ((!!res.headers.get("authorization")?.split(" ")[1] === false) && (!!data.error === true)) {
        // ! If we can't split the token string and we have a data.error message, then we throw a new error based on the message returned from backend
        throw new Error(`${data.error}`);
      }

      // * Create a blob from the data
      const blob = new Blob([data], { type: 'text/csv' });

      // * Create a data URL for the blob
      const dataUrl = window.URL.createObjectURL(blob);

      // * Create an anchor element
      const a = document.createElement('a');
      a.href = dataUrl;

      // * Set the download attribute and filename
      a.download = `${new Date().toISOString()}___all_orders_for_product.csv`;

      // * Append the anchor to the document
      document.body.appendChild(a);

      // * Programmatically click on the anchor to trigger the download
      a.click();

      // * Remove the anchor from the document
      document.body.removeChild(a);

      // * Release the blob URL
      window.URL.revokeObjectURL(dataUrl);

      dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: "Successfully fetched CSV file containing all orders for given product", flash_code: "GET_ALL_ORDERS_FOR_PRODUCT_CSV_ADMIN_SUCCESS", slice: "admin", }));
    } catch (error) {
      console.error(error);
      dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "GET_ALL_ORDERS_FOR_PRODUCT_CSV_ADMIN_ERROR", slice: "admin", }));
    }
  };
};

export const checkUpdateOrdersCsv = (targetStatus, csvFile) => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");

    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Checking CSV file content to update orders with status ${targetStatus}. Please wait...` }));

    // ? WE USE FORM DATA TO SEND FILES. THE ACCEPTED VALUES ARE STRINGS AND BLOBS
    // ? THIS IS APPARENTLY THE EASIEST WAY TO SEND FILES FROM CLIENT TO SERVER SIDE
    // * EXPLANATION ABOUT HOW STRONG PARAMS WORK WITH FORM DATA -->
    // * https://medium.com/@jugtuttle/formdata-and-strong-params-ruby-on-rails-react-c230d050e26e

    const formData = new FormData();
    formData.append("target_status", targetStatus);
    formData.append("csv_file", csvFile);

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/orders/check_update_status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData
        }
      );

        if (!res.ok) {
          throw new Error(`An error occured: Failed to check CSV file content to update orders with status ${targetStatus}...`);
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

      const orderCsvDataValid = /CSV file processed successfully/i.test(data.meta.message);

      dispatch(adminSlice.actions.setOrderRowsToUpdateFromCsvFileContent({ isValid: orderCsvDataValid, orderRows: data }));
      dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: "Successfully checked CSV file content with order to update", flash_code: "CHECK_CSV_FILE_CONTENT_TO_UPDATE_ORDERS_SUCCESS", slice: "admin", }));
    } catch (error) {
      console.error(error);
      dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "CHECK_CSV_FILE_CONTENT_TO_UPDATE_ORDERS_ERROR", slice: "admin", }));
    }
  };
};

export const persistUpdateOrdersCsv = (ordersRowsData) => {
  return async (dispatch) => {
    const token = Cookies.get("YQM-token");

    dispatch(adminSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Persisting CSV file content to update orders. Please wait...` }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/orders/update_status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bulkChangeStatus: { jsonapi_object: ordersRowsData },
          }),
        }
      );

        if (!res.ok) {
          throw new Error(`An error occured: Failed to persist CSV file content to update orders...`);
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

      dispatch(adminSlice.actions.showNotifications({ status: "success", title: "Success", message: "Successfully persisted CSV file content with order to update", flash_code: "PERSIST_CSV_FILE_CONTENT_TO_UPDATE_ORDERS_SUCCESS", slice: "admin", }));
    } catch (error) {
      console.error(error);
      dispatch(adminSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "PERSIST_CSV_FILE_CONTENT_TO_UPDATE_ORDERS_ERROR", slice: "admin", }));
    }
  };
};


export const {
  showNotifications,
  flashNotification,
  setAdminProducts,
  clearPricesTableData,
  clearPriceToEdit,
  resetOrderRowsToUpdate,
} = adminSlice.actions;
export default adminSlice.reducer;
