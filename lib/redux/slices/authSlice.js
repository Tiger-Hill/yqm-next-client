import { createSlice } from "@reduxjs/toolkit";
import baseEndpointUrl from "../../apiEndpoint";
import Cookies from "js-cookie";

export const initialState = {
  token: Cookies.get("YQM-token") ? Cookies.get("YQM-token") : null,
  user: Cookies.get("YQM-user") ? JSON.parse(Cookies.get("YQM-user")) : null, // ! If there's a token, there's a user obviously
  isLoggedIn: Cookies.get("YQM-token") ? true : false,
  userType: Cookies.get("YQM-user") ? JSON.parse(Cookies.get("YQM-user")).user_type : "Anonymous",
  userDetailsSlug: Cookies.get("YQM-userDetailsSlug") ? Cookies.get("YQM-userDetailsSlug") : null,
  notification: { status: "success", title: "Success", message: "Initialiazed the authSlice with success!", flash_code: "GENERAL_SUCCESS", slice: "auth" },
};

const authSlice = createSlice({
  name: "auth",
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

    setSession: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.userDetailsSlug = action.payload.userDetailsSlug;
      state.userType = action.payload.user.userType;
      state.isLoggedIn = true;

      if (action.payload.isRememberMeChecked) {
        const currentTime = new Date(); //
        const sameTimeTomorrow = new Date(currentTime.getTime() + (24 * 60 * 60 * 1000)) // / ((24 * 60 * 60 * 1000) / 1728)) === around 1 minute)
        Cookies.set("YQM-token", JSON.stringify(action.payload.token).slice(1, -1), { secure: true });
        Cookies.set("YQM-tokenExpirationTime", sameTimeTomorrow, { secure: true });
        Cookies.set("YQM-rememberMe", JSON.stringify(action.payload.isRememberMeChecked), { secure: true });
        Cookies.set("YQM-userEmail", action.payload.user.email, { secure: true });
      } else {
        Cookies.set("YQM-token", JSON.stringify(action.payload.token).slice(1, -1), { secure: true });
        Cookies.set("YQM-rememberMe", action.payload.isRememberMeChecked, { secure: true });
      }

      Cookies.set("YQM-user", JSON.stringify(action.payload.user), { secure: true, expires: 1 });
      Cookies.set("YQM-userDetailsSlug", action.payload.userDetailsSlug, { secure: true, expires: 1 });
    },

    destroySession: (state) => {
      state.token = null;
      state.user = null;
      state.userType = "Anonymous";
      state.isLoggedIn = false;
      state.userDetailsSlug = null;

      // const isRememberMeChecked = !!Cookies.get("YQM-rememberMe")
      // !isRememberMeChecked && Cookies.remove("YQM-userEmail");

      Cookies.remove("YQM-token");
      Cookies.remove("YQM-tokenExpirationTime");
      Cookies.remove("YQM-user");
      Cookies.remove("YQM-userDetailsSlug");
    },
  },
});

// * SIGN UP
export const signUp = (signUpDetails) => {
  return async (dispatch) => {
    dispatch(authSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: "Signing up Please wait...", flash_code: null, slice: "auth" }));

    console.log(baseEndpointUrl);
    console.log(process.env.NEXT_PUBLIC_API_URL);

    const sendRequest = async () => {
      const res = await fetch(`${baseEndpointUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Organization: `${process.env.NEXT_PUBLIC_ORGANIZATION}`,
        },
        body: JSON.stringify({
          user: {
            email: signUpDetails.email,
            password: signUpDetails.password,
            passwordConfirmation: signUpDetails.passwordConfirmation,
          },
          user_detail: {
            title: signUpDetails.title,
            firstName: signUpDetails.firstName,
            lastName: signUpDetails.lastName,
          },
        }),
      });

      if (!res.ok) {
        const errorObject = await res.json();
        console.log(errorObject);
        if (errorObject.meta.error_message.match(/Email has already been taken/i))
          throw {
            name: "Error",
            msg: "Email has already been taken",
            flash_code: "SIGNUP_EMAIL_ALREADY_TAKEN_ERROR",
          };
        if (!errorObject.meta.error_message.match(/Email has already been taken/i))
          throw {
            name: "Error",
            msg: errorObject.errors[0].detail,
            flash_code: "SIGNUP_ERROR",
          };
      }

      const data = await res.json();
      return [data, res];
    };

    try {
      const [data, res] = await sendRequest();

      if (
        // !!res.headers.get("authorization")?.split(" ")[1] === false &&
        !res.ok ||
        !!data.error === true
      ) {
        // ! If we can't split the token string and we have an data.error message, then we throw an error
        throw new Error(`${data.error}`);
      }

      dispatch( authSlice.actions.showNotifications({ status: "success", title: "Success", message: "Signup successfuly, confirm account then sign in", flash_code: "SIGN_UP_SUCCESS", slice: "auth", }));
    } catch (error) {
      // console.log(error);
      dispatch( authSlice.actions.showNotifications({ status: "error", title: "Error", message: error.msg, flash_code: error.flash_code, slice: "auth", }));
    }
  };
};

// * SIGN IN
export const signIn = (credentials, isRememberMe) => {
  return async (dispatch) => {
    dispatch(authSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: "Signing in Please wait...", flash_code: null, slice: "auth" }));

    const sendRequest = async () => {
      const res = await fetch(`${baseEndpointUrl}/users/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Organization: `${process.env.NEXT_PUBLIC_ORGANIZATION}`,
        },
        body: JSON.stringify({
          user: { email: credentials.email, password: credentials.password },
        }),
      });

      // console.log(res);

      if (!res.ok) {
        // console.log(await res.text());
        const errorText = await res.text();

        // TODO: DOUBLE CHECK SYNTAX OF EACH ERROR MESSAGE REICEVED FROM THE BACKEND TO MAKE SURE IT WORKS AS EXPECTED
        if (errorText === "Invalid Email or password.") {
          throw { name: "Error", msg: errorText, flash_code: "SIGN_IN_WRONG_CREDENTIALS_ERROR"};
        } else if (errorText === "You have to confirm your email address before continuing.") {
          throw { name: "Error", msg: errorText, flash_code: "SIGN_IN_EMAIL_NOT_CONFIRMED_ERROR"};
        } else if (errorText === "You have one more attempt before your account is locked.") {
          throw { name: "Error", msg: errorText, flash_code: "SIGN_IN_ONE_MORE_ATTEMPT_LEFT_ERROR"};
        } else if (errorText === "Your account is locked.") {
          throw { name: "Error", msg: errorText, flash_code: "SIGN_IN_ACCOUNT_LOCKED_ERROR"};
        } else {
          // ! Default case to catch any other error
          throw { name: "Error", msg: errorText, flash_code: "SIGN_IN_ERROR"};
        }
      }

      const data = await res.json();
      return [data, res];
    };

    try {
      const [data, res] = await sendRequest();
      console.log(data);
      console.log(res)

      if (!!res.headers.get("authorization")?.split(" ")[1] === false && !!data.error === true) {
        // ! If we can't split the token string and we have an data.error message, then we throw an error
        throw new Error(`${data.error}`);
      }

      const authToken = res.headers.get("authorization").split(" ")[1];
      const user = data.data.attributes;

      // TODO: REMOVE THIS ONCE ITS FIXED IN BACKED
      // user.user_type= "Anonymous"

      const userDetailsSlug = data.included[0].id;
      console.log("SIGN IN USER DETAIL SLUG BEFORE SETTING UP THE COOKIES: --> ", userDetailsSlug);

      dispatch(authSlice.actions.setSession({ token: authToken, user: user, userDetailsSlug: userDetailsSlug, isRememberMeChecked: isRememberMe }) );
      dispatch(authSlice.actions.showNotifications({ status: "success", title: "Success", message: data.meta.message, flash_code: "SIGN_IN_SUCCESS", slice: "auth" }));
    } catch (error) {
      console.log(error);
      dispatch(authSlice.actions.showNotifications({ status: "error", title: "Error", message: error.msg, flash_code: error.flash_code, slice: "auth" })
      );
    }
  };
};



// * UNLOCK ACCOUNT
export const unlockAccount = (unlockToken) => {
  return async (dispatch) => {
    dispatch(authSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: "Unlocking account. Please wait...", flash_code: null, slice: "auth" }));

    const sendRequest = async () => {
      const res = await fetch(`${baseEndpointUrl}/users/unlock?unlock_token=${unlockToken}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("An error occured: Failed to unlock your account...")
      }

      const data = await res.json();
      return [data, res];
    };

    // ! BELOW BLOCK IS A BIT WEIRD, BECAUSE NO MATTER IF RES IS OK OR NOT, WE DESTROY THE SESSION.
    // ! NOTICE THAT WE DISPATCH THE destroySession ACTION IN BOTH TRY AND CATCH BLOCKS.
    try {
      const [data, res] = await sendRequest();

      if (!res.ok) {
        // ! If we can't split the token string and we have a data.error message, then we throw a new error based on the message returned from backend
        throw new Error(`${data.error}`);
      }

      dispatch(authSlice.actions.showNotifications({status: "success", title: "Success", message: `Successfully unlocked account`, flash_code: "UNLOCK_ACCOUNT_SUCCESS", slice: "auth" }));
    } catch (error) {
      dispatch(authSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "UNLOCK_ACCOUNT_ERROR", slice: "auth" }));
    }
  };
};


// * SIGN OUT
export const signOut = (logoutType = "manual") => {
  return async (dispatch) => {
    dispatch(authSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: "Signing in Please wait...", flash_code: null, slice: "auth" }));
    const token = Cookies.get("YQM-token");

    const sendRequest = async () => {
      const res = await fetch(`${baseEndpointUrl}/users/sign_out`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          // Organization: `${process.env.NEXT_PUBLIC_ORGANIZATION}`,
        },
      });

      if (!res.ok) {
        throw new Error("An error occured: Failed to sign out...");
      }

      return res.json();
    };

    // ! BELOW BLOCK IS A BIT WEIRD, BECAUSE NO MATTER IF RES IS OK OR NOT, WE DESTROY THE SESSION.
    // ! NOTICE THAT WE DISPATCH THE destroySession ACTION IN BOTH TRY AND CATCH BLOCKS.
    try {
      const data = await sendRequest();
      console.log(data);

      if (data.error) throw new Error(`${data.error}`);

      dispatch(authSlice.actions.destroySession());
      if (logoutType === "manual") {
        dispatch(authSlice.actions.showNotifications({ status: "success", title: "Success", message: "Signed out successfully!", flash_code: "SIGN_OUT_SUCCESS", slice: "auth" }));
      } else if (logoutType === "auto"){
        dispatch(authSlice.actions.showNotifications({ status: "success", title: "Success", message: "Auto-signed out successfully!", flash_code: "AUTO_SIGN_OUT_SUCCESS", slice: "auth" }));
      }
    } catch (error) {
      dispatch(authSlice.actions.destroySession());
      dispatch(authSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "SIGN_OUT_ERROR", slice: "auth" }));
    }
  };
};

export const {
  showNotifications,
  flashNotification,
  // checkForToken,
  destroySession,
  setSession,
} = authSlice.actions;
export default authSlice.reducer;
