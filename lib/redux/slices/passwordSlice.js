import { createSlice } from "@reduxjs/toolkit";
import baseEndpointUrl from "../../apiEndpoint";
import Cookies from "js-cookie";

export const initialState = {
  notification: { status: "success", title: "Success", message: "Successfully set up the password slice!", flash_code: "GENERAL_SUCCESS", slice: "password" }, // ? OBJECT
};

const passwordSlice = createSlice({
  name: "password",
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
  },
});


// ! ===================================================================================================================
// ! --------------------------------------------- POST - CHANGE PASSWORD#FORGOT ---------------------------------------------
// ! ===================================================================================================================
export const sendForgotPasswordInstructions = (userEmail) => {
  return async (dispatch) => {
    // const token = Cookies.get("TH-token");
    const notificationInitialState = passwordSlice.getInitialState().notification;

    dispatch(passwordSlice.actions.showNotifications({ ...notificationInitialState, status: "pending", title: "Sending...", message: `Sending request instructions to change password for email: ${userEmail}. Please wait...`}));

    const sendRequest = async () => {
      const res = await fetch(`${baseEndpointUrl}/users/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
          // Organization: `${process.env.NEXT_PUBLIC_ORGANIZATION}`,
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!res.ok) {
        throw new Error(`An error occured: Failed to request forgot password instructions to email: ${userEmail}`);
      }

      const data = await res.json();
      return [data, res];
    };

    try {
      const [data, res] = await sendRequest();
      console.log(data);

      if (!!data.error === true || !res.ok) {
        // ! If we can't split the token string and we have a data.error message, then we throw a new error based on the message returned from backend
        throw new Error(`${data.error}`);
      }

      dispatch(passwordSlice.actions.showNotifications({ ...notificationInitialState, status: "info", title: "Success", message: `Successfully requested instructions to change password for email: ${userEmail}`, flash_code: "FORGOT_PASSWORD_INFO", slice: "password" }));
    } catch (error) {
      // ! AS WE DON'T WANT TO GIVE AWAY THE FACT THAT THE EMAIL DOESN'T EXIST IN OUR DATABASE, WE RENDER A SUCCESS MESSAGE IN ALL CASES
      dispatch(passwordSlice.actions.showNotifications({ ...notificationInitialState, status: "info", title: "Success", message: `Successfully requested instructions to change password for email: ${userEmail}`, flash_code: "FORGOT_PASSWORD_INFO", slice: "password" }));
    }
  };
}

// ! ===================================================================================================================
// ! ---------- PUT - UPDATE PASSWORD WHILE LOGGED IN# /users (registration controller) ----------
// ! ===================================================================================================================
export const updatePasswordWhileLoggedIn = (passwordData) => {
  return async (dispatch) => {
    const token = Cookies.get("SESAME-token");
    const notificationInitialState = passwordSlice.getInitialState().notification;

    dispatch(passwordSlice.actions.showNotifications({ ...notificationInitialState, status: "pending", title: "Sending...", message: `Sending request to update your password. Please wait...`}));

    const sendRequest = async () => {
      const res = await fetch(`${baseEndpointUrl}/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user: { ...passwordData }}),
      });

      if (!res.ok) {
        const errorObject = await res.json();
        if (errorObject.errors.some((error) => error.detail === "Current password is incorrect"))
          throw {
            name: "Error",
            msg: "Current password is incorrect",
            flash_code: "UPDATE_PASSWORD_WHILE_LOGGED_IN_CURRENT_PASSWORD_ERROR",
          };
        if (!errorObject.errors.some((error) => error.detail === "Current password is incorrect"))
          throw {
            name: "Error",
            msg: errorObject.errors[0].detail,
            flash_code: "UPDATE_PASSWORD_WHILE_LOGGED_IN_ERROR",
          };
      }

      const data = await res.json();
      return [data, res];
    };

    try {
      const [data, res] = await sendRequest();
      // console.log(data);

      if (!!data.error === true || !res.ok) {
        // ! If we can't split the token string and we have a data.error message, then we throw a new error based on the message returned from backend
        throw new Error(`${data.error}`);
      }

      dispatch(passwordSlice.actions.showNotifications({ ...notificationInitialState, status: "success", title: "Success", message: `Successfully updated password`, flash_code: "UPDATE_PASSWORD_WHILE_LOGGED_IN_SUCCESS", slice: "password" }));
    } catch (error) {
      // console.log(error);
      dispatch(passwordSlice.actions.showNotifications({ status: "error", title: "Error", message: error.msg, flash_code: error.flash_code, slice: "password" }));
    }
  };
}

// ! ===================================================================================================================
// ! --------------------------------------------- PUT - UPDATE PASSWORD# users/password when logged out---------------------------------------------
// ! ===================================================================================================================
export const updatePassword = (passwordData) => {

  console.log("password Data", passwordData);
  return async (dispatch) => {
    const notificationInitialState = passwordSlice.getInitialState().notification;

    dispatch(passwordSlice.actions.showNotifications({ ...notificationInitialState, status: "pending", title: "Sending...", message: `Sending request to change password. Please wait...`}));

    const sendRequest = async () => {
      const res = await fetch(`${baseEndpointUrl}/users/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: { ...passwordData }}),
      });

      if (!res.ok) {
        throw new Error(`An error occured: Failed to request forgot password instructions to email: ${userEmail}`);
      }

      const data = await res.json();
      return [data, res];
    };

    try {
      const [data, res] = await sendRequest();
      // console.log(data);

      if (!!data.error === true || !res.ok) {
        // ! If we can't split the token string and we have a data.error message, then we throw a new error based on the message returned from backend
        throw new Error(`${data.error}`);
      }

      dispatch(passwordSlice.actions.showNotifications({ ...notificationInitialState, status: "success", title: "Success", message: `Successfully updated password`, flash_code: "UPDATE_PASSWORD_SUCCESS", slice: "password" }));
    } catch (error) {
      dispatch(passwordSlice.actions.showNotifications({ ...notificationInitialState, status: "error", title: "Error", message: `Error while updating the password `, flash_code: "UPDATE_PASSWORD_ERROR", slice: "password" }));
    }
  };
}

// ! ===================================================================================================================
// ! --------------------------------------------- GET - USERS/CONFIRMATION (CONFIRM ACCOUNT) ---------------------------------------------
// ! ===================================================================================================================
// * This is the action creator that will be called when the user clicks on the confirmation link sent to their email
export const confirmAccount = (confirmationToken) => {
  return async (dispatch) => {
    const notificationInitialState = passwordSlice.getInitialState().notification;

    dispatch(passwordSlice.actions.showNotifications({ ...notificationInitialState, status: "pending", title: "Sending...", message: `Confirming account. Please wait...`}));

    const sendRequest = async () => {
      const res = await fetch(`${baseEndpointUrl}/users/confirmation?confirmation_token=${confirmationToken}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Organization: `${process.env.NEXT_PUBLIC_ORGANIZATION}`,
        },
      });

      if (!res.ok) {
        throw new Error(
          // TODO: ADD FLASH FOR THIS ERROR
          `An error occured: Failed to confirm user account...`
        );
      }

      const data = await res.json();
      return [data, res];
    };

    try {
      const [data, res] = await sendRequest();

      if ((!!data.error === true)) { throw new Error(`${data.error}`) }

      // TODO: ADD FLASH FOR THIS ERROR
      dispatch(passwordSlice.actions.showNotifications({ ...notificationInitialState, status: "success", title: "Success", message: `Successfully confirmed account`, flash_code: "CONFIRM_ACCOUNT_SUCCESS", slice: "password" }));
    } catch (error) {
      dispatch(passwordSlice.actions.showNotifications({ ...notificationInitialState, status: "error", title: "Error", message: error.message, flash_code: "CONFIRM_ACCOUNT_ERROR", slice: "password" }));
    }
  };
}

// ! ===================================================================================================================
// ! --------------------------------------------- POST - USERS/CONFIRMATION (RESEND CONFIRMATION INSTRUCTIONS) ---------------------------------------------
// ! ===================================================================================================================
// * This is the action creator that will be called when the user clicks on the confirmation link sent to their email
export const resendConfirmationInstructions = (userEmail) => {
  return async (dispatch) => {
    const notificationInitialState = passwordSlice.getInitialState().notification;

    dispatch(passwordSlice.actions.showNotifications({ ...notificationInitialState, status: "pending", title: "Sending...", message: `Resending confirmation instructions to email: ${userEmail}...`}));

    const sendRequest = async () => {
      const res = await fetch(`${baseEndpointUrl}/users/confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!res.ok) {
        throw new Error(
          // TODO: ADD FLASH FOR THIS ERROR
          `An error occured: Failed to resend confirmation instructions...`
        );
      }

      const data = await res.json();
      return [data, res];
    };

    try {
      const [data, res] = await sendRequest();

      if ((!!data.error === true)) { throw new Error(`${data.error}`) }

      // TODO: ADD FLASH FOR THIS ERROR
      dispatch(passwordSlice.actions.showNotifications({ ...notificationInitialState, status: "info", title: "Success", message: `Successfully resent confirmation instructions`, flash_code: "RESEND_CONFIRMATION_INSTRUCTIONS_SUCCESS", slice: "password", slice: "password" }));
    } catch (error) {
      // ! AS WE DON'T WANT TO GIVE AWAY THE FACT THAT THE EMAIL DOESN'T EXIST IN OUR DATABASE, WE RENDER A SUCCESS MESSAGE IN ALL CASES
      dispatch(passwordSlice.actions.showNotifications({ ...notificationInitialState, status: "info", title: "Success", message: `Successfully resent confirmation instructions`, flash_code: "RESEND_CONFIRMATION_INSTRUCTIONS_SUCCESS", slice: "password", slice: "password" }));
    }
  };
}

export const { showNotifications, flashNotification } = passwordSlice.actions;
export default passwordSlice.reducer;
