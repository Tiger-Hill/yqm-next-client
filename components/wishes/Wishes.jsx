"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getForWishingProducts } from "@/lib/redux/slices/productSlice";
import { motion } from "framer-motion";

import Pagination from "@mui/material/Pagination";

import Image from "next/image";
import InputMui from "../forms/InputMui";
import classes from "./Wishes.module.scss";

const Wishes = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { productsToWish, maxNumberOfForWishingProducts } = useSelector(state => state.rootReducer.product);

  // * Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20); // 10 / 30 / 50

  // * Fetches products for the first page, when rendering the page
  useEffect(() => {
    dispatch(getForWishingProducts(1));
  }, [])

  // * Handler executed when user changes pages using the pagination component
  const changePageHandler = (e, value) => {
    setPage(value);
  };

  // * Fetches products for a given page
  useEffect(() => {
    dispatch(getForWishingProducts(page, searchInputValue));
    window && window.scrollTo({ top: 0, behavior: "smooth", });
  }, [page])

  // ! Search input handler
  const [searchInputValue, setSearchInputValue] = useState("");

  const searchInputHandler = (e) => {
    if (!e.target.value) {
      setSearchInputValue("");
    } else {
      setSearchInputValue(e.target.value);
    }
  }

  useEffect(() => {
    // * We send the request to the server only if the user has typed something
    // * We delay the request by 300ms to avoid sending too many requests
    const sendFilteredRequest = setTimeout(() => {
      //? We use page 1 to make sure we get on page 1 for the filtered results
      setPage(1);
      dispatch(getForWishingProducts(page, searchInputValue));
    }, 300);

    // * Debouncing here after 300 ms.
    // * Request gets cancelled if searchInputValue changes before 300ms
    return () => clearTimeout(sendFilteredRequest);
  }, [searchInputValue])

  return (
    <section>
      <header className={classes["public-page-header"]}>
        <Image
          src="/IMGS/wishes.jpg"
          alt="A man looking towards a mountain. We can see a city in between bathed in sunset light."
          width={4000}
          height={4000}
        />

        <div className={classes["header-content"]}>
          <motion.h1
            transition={{ duration: 0.25 }}
            initial={{ opacity: 0, height: "auto" }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: "auto" }}
          >
            Wishes
          </motion.h1>

          <InputMui
            // required
            id="outlined-required searchInput"
            width={"150%"}
            name="searchInput"
            type="searchInput"
            label="Search for wishes"
            // helperText={formik.errors.email && formik.errors.email}
            onChangeHandler={(e) => searchInputHandler(e)}
            // onBlurHandler={formik.handleBlur}
            // error={!!formik.touched.email && !!formik.errors.email}
            // valid={!!formik.touched.email && !formik.errors.email}
            // // defaultValue="email"
          />
        </div>
      </header>

      {productsToWish && (
        <article>
          <div className={classes["wishes-grid-container"]}>
            {productsToWish && productsToWish.map(product => (
              <div className={classes["wish-card"]} key={product.slug}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
                  alt={product.productName}
                  width={200}
                  height={200}
                />
                <h4>{product.productName}</h4>
                <p>{product.description}</p>
              </div>
            ))}
          </div>

          <Pagination
            count={Math.ceil(maxNumberOfForWishingProducts / limit)}
            page={page}
            shape="rounded"
            onChange={(event, value) => changePageHandler(event, value)}
            sx={{
              margin: "2rem auto",

              "& .MuiPagination-ul": {
                justifyContent: "center",
              },

              "& .MuiPaginationItem-root": {
                color: "black",
                fontWeight: "bold",
                fontSize: "1.7rem",
              },

              "& .MuiSvgIcon-root": {
                fontSize: "2.5rem",
              },
            }}
          />
        </article>
      )}
    </section>
  );
}

export default Wishes
