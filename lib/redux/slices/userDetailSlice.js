import { createSlice } from "@reduxjs/toolkit";
import baseEndpointUrl from "../../apiEndpoint";
import Cookies from "js-cookie";

export const initialState = {
  notification: {
    status: "success",
    title: "Success",
    message: "Successfully set up the user detail slice!",
    flash_code: "GENERAL_SUCCESS",
    slice: "userDetail",
  }, // ? OBJECT

  // personal: {
  //   label: "Personal",
  //   index: 0,
  //   sectionCompletion: "incomplete",
  //   missingInputs: [],
  // },
  // birth: {
  //   label: "Birth",
  //   index: 1,
  //   sectionCompletion: "incomplete",
  //   missingInputs: [],
  // },
  // address: {
  //   label: "Address",
  //   index: 2,
  //   sectionCompletion: "incomplete",
  //   missingInputs: [],
  // },
  // mailing: {
  //   label: "Address",
  //   index: 2,
  //   sectionCompletion: "incomplete",
  //   missingInputs: [],
  // },
  // bank: {
  //   label: "Bank",
  //   index: 3,
  //   sectionCompletion: "incomplete",
  //   missingInputs: [],
  // },
  // tax: {
  //   label: "Tax",
  //   index: 4,
  //   sectionCompletion: "incomplete",
  //   missingInputs: [],
  // },
  // documents: {
  //   label: "Documents",
  //   index: 5,
  //   sectionCompletion: "incomplete",
  //   missingInputs: [],
  // },

  userDetails: null,
  isUserDetailsComplete: null,

  // signatureFileInfo: null,
  passportFileInfo: null,
  // proofOfAddressFileInfo: null,
  // usTaxEvidenceFileInfo: null,
};

const userDetailSlice = createSlice({
  name: "userDetail",
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

    updateDetails: (state, action) => {
      state.userDetails = action.payload.userDetails;
      // state.isUserDetailsComplete = action.payload.isUserDetailsComplete;
    },

    updateUserDetailPassport: (state, action) => {
      state.passportFileInfo = action.payload.passport;
    },
  },
});

// * WE USE THIS LINE TO MAKE THE DISPATCHING OF THE "showNotification" EASIER (for flashes)
const userDetailsInitialState = userDetailSlice.getInitialState().notification;


// ! IMPORTANT: WE NOW USE SERVER SIDE RENDERING, SO WE DON'T NEED TO DISPATCH THE "getUserDetails" ACTION ON THE CLIENT SIDE
// * GET USER DETAILS (:SHOW)
export const getUserDetails = () => {
  return async (dispatch) => {
    const token = Cookies.get("SESAME-token");
    const userDetailsSlugReference = Cookies.get("SESAME-userDetailsSlug");

    dispatch(userDetailSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Fetching user details for user with slug ${userDetailsSlugReference}. Please wait...` }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/user_details/${userDetailsSlugReference}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            // Organization: `${process.env.NEXT_PUBLIC_ORGANIZATION}`,
          },
        }
        );

        if (!res.ok) {
          throw new Error(`An error occured: Failed to fetch the user details for user ${userDetailsSlugReference}...`);
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

      const passportData = data?.included?.find(instance => instance.type === "document")?.attributes
      console.log(passportData);

      dispatch(userDetailSlice.actions.updateUserDetailPassport({ passport: passportData }));
      dispatch(userDetailSlice.actions.updateDetails({ userDetails: data.data.attributes }));
      dispatch(userDetailSlice.actions.showNotifications({ status: "success", title: "Success", message: `Successfully received user details with slug ${userDetailsSlugReference}` }));
    } catch (error) {
      console.error(error);
      dispatch(userDetailSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message }));
    }
  };
};


// * UPDATE USER DETAILS (#UPDATE)
export const updateUserDetails = (userDetails) => {
  return async (dispatch) => {
    const token = Cookies.get("SESAME-token");
    const userDetailsSlug = Cookies.get("SESAME-userDetailsSlug");

    dispatch(userDetailSlice.actions.showNotifications({ ...userDetailsInitialState, status: "pending", title: "Sending...", message: `Starting to update the user details for user detail with slug ${userDetailsSlug}...`, }));

    // ? WE USE FORM DATA TO SEND FILES. THE ACCEPTED VALUES ARE STRINGS AND BLOBS
    // ? THIS IS APPARENTLY THE EASIEST WAY TO SEND FILES FROM CLIENT TO SERVER SIDE
    // * EXPLANATION ABOUT HOW STRONG PARAMS WORK WITH FORM DATA -->
    // * https://medium.com/@jugtuttle/formdata-and-strong-params-ruby-on-rails-react-c230d050e26e

    const formData = new FormData();
    for (const property in userDetails) {
      formData.append(`user_detail[${property}]`, userDetails[property]);
    }

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/user_details/${userDetailsSlug}`,
        {
          method: "PATCH",
          headers: {
            // ! CONTENT TYPE NOT NEEDED IN CASE WE SEND A FORM DATA
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to update the user details with slug ${userDetailsSlug}...`);
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

      const passportData = data?.included?.find(instance => instance.type === "document")?.attributes
      console.log(passportData);

      dispatch(userDetailSlice.actions.updateUserDetailPassport({ passport: passportData }));
      dispatch(userDetailSlice.actions.updateDetails({ userDetails: data.data.attributes }));
      dispatch(userDetailSlice.actions.showNotifications({ ...userDetailsInitialState, status: "success", title: "Success", message: `Sucessfully updated the user details with slug: ${userDetailsSlug}`, flash_code: "USER_DETAIL_UPDATE_SUCCESS" }));
    } catch (error) {
      dispatch(userDetailSlice.actions.showNotifications({ ...userDetailsInitialState, status: "error", title: "Error", message: error.message, flash_code: "USER_DETAIL_UPDATE_ERROR" }));
    }
  };
};

export const {
  showNotifications,
  flashNotification,
  createTemporarySignatureURL,
  createTemporaryPassportURL,
  setIsUserDetailComplete,
} = userDetailSlice.actions;
export default userDetailSlice.reducer;
