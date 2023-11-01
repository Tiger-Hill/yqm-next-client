import { createSlice } from "@reduxjs/toolkit";
import baseEndpointUrl from "../../apiEndpoint";
import Cookies from "js-cookie";

export const initialState = {
  transactions: null, // ? ARRAY
  sellingTransaction: null, // ? OBJECT
  vault: null,
  notification: {
    status: "success",
    title: "Success",
    message: "Successfully set up the transaction slice!",
    flash_code: "GENERAL_SUCCESS",
    slice: "basket",
  }, // ? OBJECT
};

const transactionSlice = createSlice({
  name: "transaction",
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

    setTransactions: (state, action) => {
      const transactions= [];
      const includedData = action.payload.included; // ? Helper, to make it shorter to read code

      action.payload.data.forEach(transaction => {
        const transactionData = {...transaction.attributes, slug: transaction.id};
        const productData = includedData.find(instance => instance.type === "product" && instance.id === transaction.relationships.product.data.id).attributes;

        transactions.push({ transactionDetails: transactionData, productDetails: productData });
      })

      state.transactions = transactions;
    },

    // setSellingTransaction: (state, action) => {
    //   const includedData = action.payload.included; // ? Helper, to make it shorter to read code
    //   const transactionData = {...action.payload.data.attributes, slug: action.payload.data.id};
    //   const productData = includedData.find(instance => instance.type === "product" && instance.id === action.payload.data.relationships.product.data.id).attributes;

    //   state.sellingTransaction = { transactionDetails: transactionData, productDetails: productData };
    // },

    setSellingTransaction: (state, action) => {
      state.sellingTransaction = state.vault.find(transaction => transaction.transactionDetails.slug === action.payload);
    },

    resetSellingTransaction: (state) => {
      state.sellingTransaction = null;
    },

    // ! VAULT
    setVault: (state, action) => {
      const vault = [];
      const includedData = action.payload.included; // ? Helper, to make it shorter to read code

      action.payload.data.forEach(transaction => {
        const transactionData = {...transaction.attributes, slug: transaction.id};
        const productData = includedData.find(instance => instance.type === "product" && instance.id === transaction.relationships.product.data.id).attributes;

        vault.push({ transactionDetails: transactionData, productDetails: productData });
      })

      state.vault = vault;
    }
  },
});

// * GET ALL TRANSACTIONS
export const getAllTransactions = () => {
  return async (dispatch) => {
    const token = Cookies.get("SESAME-token");

    dispatch(transactionSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: "Starting to fetch all transactions...", }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/transactions/overview`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("An error occured: Failed to fetch all transactions...");
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

      dispatch(transactionSlice.actions.setTransactions(data));
      dispatch(transactionSlice.actions.showNotifications({ status: "success", title: "Success", message: "Sucessfully fetched all transactions", flash_code: "GET_ALL_TRANSACTIONS_SUCCESS" }));
    } catch (error) {
      dispatch(transactionSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "GET_ALL_TRANSACTIONS_ERROR" }));
    }
  };
};

// // * GET A SINGLE TRANSACTION
// export const getTransaction = (transactionSlug) => {
//   return async (dispatch) => {
//     const token = Cookies.get("SESAME-token");

//     dispatch(transactionSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Starting to fetch transaction with slug ${transactionSlug}...` }));

//     const sendRequest = async () => {
//       const res = await fetch(
//         `${baseEndpointUrl}/api/v1/transactions/${transactionSlug}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`An error occured: Failed to fetch transaction with slug ${transactionSlug}...`);
//       }

//       const data = await res.json();
//       return [data, res];
//     };

//     try {
//       const [data, res] = await sendRequest();
//       console.log(data);

//       if ((!!res.headers.get("authorization")?.split(" ")[1] === false) && (!!data.error === true)) {
//         // ! If we can't split the token string and we have a data.error message, then we throw a new error based on the message returned from backend
//         throw new Error(`${data.error}`);
//       }

//       dispatch(transactionSlice.actions.setSellingTransaction(data));
//       dispatch(transactionSlice.actions.showNotifications({ status: "success", title: "Success", message: `Sucessfully fetched transaction with slug ${transactionSlug}`, flash_code: "GET_TRANSACTION_SUCCESS" }));
//     } catch (error) {
//       dispatch(transactionSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "GET_TRANSACTION_ERROR" }));
//     }
//   };
// };

// * GET VAULT
export const getVault = () => {
  return async (dispatch) => {
    const token = Cookies.get("SESAME-token");

    dispatch(transactionSlice.actions.showNotifications({ status: "pending", title: "Sending...", message: `Starting to fetch vault data...` }));

    const sendRequest = async () => {
      const res = await fetch(
        `${baseEndpointUrl}/api/v1/transactions/vault`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`An error occured: Failed to fetch vault data...`);
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

      dispatch(transactionSlice.actions.setVault(data));
      dispatch(transactionSlice.actions.showNotifications({ status: "success", title: "Success", message: `Sucessfully fetched vault data`, flash_code: "GET_VAULT_SUCCESS" }));
    } catch (error) {
      dispatch(transactionSlice.actions.showNotifications({ status: "error", title: "Error", message: error.message, flash_code: "GET_VAULT_ERROR" }));
    }
  };
};



export const { showNotifications,flashNotification, setSellingTransaction, resetSellingTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
