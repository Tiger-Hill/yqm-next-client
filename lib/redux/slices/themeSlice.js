import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
// import baseEndpointUrl from "../../apiEndpoint";

export const initialState = {
  notification: {
    status: "success",
    title: "Success",
    message: "Successfully set up the theme slice!",
    flash_code: "GENERAL_SUCCESS",
    slice: "theme",
  }, // ? OBJECT
  theme: Cookies.get("theme") || "light", // ? STRING
};

// ! WILL MOST LIKELY STAY EMPTY FOREVER. WE SET UP THE ORANISATION NAME MANUALLY HERE
const themeSlice = createSlice({
  name: "theme",
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

    setDarkTheme: (state) => {
      document.body.setAttribute("data-theme", "dark");
      Cookies.set("theme", "dark", { expires: 365 });
      state.theme = "dark";
    },

    setLightTheme: (state) => {
      document.body.setAttribute("data-theme", "light");
      Cookies.set("theme", "light", { expires: 365 });
      state.theme = "light";
    }

  },
});

export const { setDarkTheme, setLightTheme } = themeSlice.actions;
export default themeSlice.reducer;
