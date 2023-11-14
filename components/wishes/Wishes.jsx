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
  const { productsToWish } = useSelector(state => state.rootReducer.product);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20); // 10 / 30 / 50
  const [maxNumberOfPages, setMaxNumberOfPages] = useState(0); // Math.ceil(totalNumberOfFoundProducts / limit)

  useEffect(() => {
    dispatch(getForWishingProducts({ page: page, limit: limit }));
  }, [])

  console.log(maxNumberOfPages);

  useEffect(() => {
    if (!productsToWish) return;
    setMaxNumberOfPages(prevState => Math.ceil(1 / limit));
  }, [productsToWish]);

  // ? This is the handler executed when user changes pages using the pagination component
  const changePageHandler = (e, value) => {
    setPage(value);
    dispatch(getForWishingProducts({ page: value, limit: limit }));
  }

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
            required
            id="outlined-required searchInput"
            width={"150%"}
            name="searchInput"
            type="searchInput"
            label="Search For Wishes"
            // helperText={formik.errors.email && formik.errors.email}
            onChangeHandler={() => alert("FILTERING THE WISHES")}
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
            {/* {productsToWish.map(product => ( */}
            {[
              ...productsToWish,
              ...productsToWish,
              ...productsToWish,
              ...productsToWish,
              ...productsToWish,
              ...productsToWish,
              ...productsToWish,
              ...productsToWish,
              ...productsToWish,
              ...productsToWish,
            ].map(product => (
              <div className={classes["wish-card"]} key={product.slug}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
                  alt={product.productName}
                  width={100}
                  height={100}
                />
                <h4>{product.productName}</h4>
                <p>{product.description}</p>
              </div>
            ))}
          </div>

          <Pagination
            count={maxNumberOfPages}
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
                // fontWeight: "bold",
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
