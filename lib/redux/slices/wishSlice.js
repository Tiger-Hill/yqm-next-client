import { createSlice } from "@reduxjs/toolkit";
import baseEndpointUrl from "../../apiEndpoint";
import Cookies from "js-cookie";

export const initialState = {

  notification: {
    status: "success",
    title: "Success",
    message: "Successfully set up the wish slice!",
    flash_code: "GENERAL_SUCCESS",
    slice: "product",
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

    setWishes: (state, action) => {
      state.wishes = action.payload;
    },
  },
});



export const { showNotifications, flashNotification, setWishes } = wishSlice.actions;
export default wishSlice.reducer;
