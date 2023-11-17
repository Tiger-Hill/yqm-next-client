import { createSlice } from "@reduxjs/toolkit";
import baseEndpointUrl from "../../apiEndpoint";
import Cookies from "js-cookie";

export const initialState = {
  userWishes: null, // ? ARRAY
  userWishToShow: null, // ? OBJECT

  notification: {
    status: "success",
    title: "Success",
    message: "Successfully set up the wish slice!",
    flash_code: "GENERAL_SUCCESS",
    slice: "wish",
  }, // ? OBJECT
};

const wishSlice = createSlice({
  name: "wish",
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
      state.notification = {
        ...state.notification,
        status: "flashed",
      };
    },

    setUserWishes: (state, action) => {
      state.userWishes = action.payload.userWishes;
    },

    setUserWishToShow: (state, action) => {
      state.userWishToShow = action.payload.userWish;
    },

    clearUserWishToShow: state => {
      state.userWishToShow = null;
    },

    addWishToUserWishes: (state, action) => {
      const userWish = action.payload.userWish;
      state.userWishes.push(userWish);
    },

    updateUserWish: (state, action) => {
      const userWish = action.payload.userWish;
      const userWishIndex = state.userWishes.findIndex(userWish => userWish.id === userWish.id);
      state.userWishes[userWishIndex] = userWish;
    }
  },
});


export const getAllUserWishes = () => {
  return async dispatch => {
    const token = Cookies.get("YQM-token");

    dispatch(wishSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Fetching all user wishes...`, slice: "wish" }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/wishes/overview`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to fetch all user wishes...`);
      }

      console.log(res);
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

      const userWishes = [];
      data.data.map(userWish => {
        const userWishObject = userWish.attributes;
        const product = data.included.find(object => object.type === "product" && object.id === userWish.relationships.product.data.id);
        userWishObject["product"] = product.attributes;
        userWishes.push(userWishObject);
      });

      dispatch(wishSlice.actions.setUserWishes({ userWishes: userWishes }));
      dispatch(wishSlice.actions.showNotifications({ status: "success", title: "Success", message: "Successfully fetched all user wishes", flash_code: "GET_ALL_USER_WISHES_SUCCESS", slice: "wish" })
      );
    } catch (error) {
      console.error(error);
      dispatch(wishSlice.actions.showNotifications({ status: "error", title: "Error", message: "Failed to fetch all user wishes", flash_code: "GET_ALL_USER_WISHES_ERROR", slice: "wish" })
      );
    }
  };
};

export const getUserWish = (userWishSlug) => {
  return async dispatch => {
    const token = Cookies.get("YQM-token");

    dispatch(wishSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Fetching user wish with slug ${userWishSlug}...`, slice: "wish" }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/wishes/${userWishSlug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to fetch user wish with slug ${userWishSlug}...`);
      }

      console.log(res);
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

      const userWish = {
        ...data.data.attributes,
        product: data.included.find(object => object.type === "product" && object.id === data.data.relationships.product.data.id).attributes,
      };

      dispatch(wishSlice.actions.setUserWishToShow({ userWish: userWish }));
      dispatch(wishSlice.actions.showNotifications({ status: "success", title: "Success", message: "Successfully fetched user wish", flash_code: "GET_USER_WISH_SUCCESS", slice: "wish" })
      );
    } catch (error) {
      console.error(error);
      dispatch(wishSlice.actions.showNotifications({ status: "error", title: "Error", message: "Failed to fetch user wish", flash_code: "GET_USER_WISH_ERROR", slice: "wish" }));
    }
  };
};

export const createWish = (wish) => {
  return async dispatch => {
    const token = Cookies.get("YQM-token");

    dispatch(wishSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Creating a new wish...`, slice: "wish" }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/wishes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ wish: wish }),
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to create a new wish...`);
      }

      console.log(res);
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

      const userWish = {
        ...data.data.attributes,
        product: data.included.find(object => object.type === "product" && object.id === data.data.relationships.product.data.id).attributes,
      };

      dispatch(wishSlice.actions.addWishToUserWishes({ userWish: userWish }));
      dispatch(wishSlice.actions.showNotifications({ status: "success", title: "Success", message: "Successfully created a new wish", flash_code: "CREATE_WISH_SUCCESS", slice: "wish" }));
    } catch (error) {
      console.error(error);
      dispatch(wishSlice.actions.showNotifications({ status: "error", title: "Error", message: "Failed to create a new wish", flash_code: "CREATE_WISH_ERROR", slice: "wish" }));
    }
  }
};

export const updateWish = (wishSlug, wishData) => {
  return async dispatch => {
    const token = Cookies.get("YQM-token");

    dispatch(wishSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Updating wish with slug ${wishSlug}...`, slice: "wish" }));

    const sendRequest = async () => {
      const res = await fetch(`${baseEndpointUrl}/api/v1/wishes/${wishSlug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ wish: wishData }),
      });

      if (!res.ok) {
        throw new Error(`An error occured: Failed to update wish with slug ${wishSlug}...`);
      }

      console.log(res);
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

      const userWish = {
        ...data.data.attributes,
        product: data.included.find(object => object.type === "product" && object.id === data.data.relationships.product.data.id).attributes,
      };

      dispatch(wishSlice.actions.updateUserWish({ userWish: userWish }));
      dispatch(wishSlice.actions.showNotifications({ status: "success", title: "Success", message: "Successfully updated wish", flash_code: "UPDATE_WISH_SUCCESS", slice: "wish" }));
    } catch (error) {
      console.error(error);
      dispatch(wishSlice.actions.showNotifications({ status: "error", title: "Error", message: "Failed to update wish", flash_code: "UPDATE_WISH_ERROR", slice: "wish" }));
    }
  }
};

export const { showNotifications, flashNotification, setWishes, clearUserWishToShow } =
  wishSlice.actions;
export default wishSlice.reducer;
