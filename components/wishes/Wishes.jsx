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
  const [limit, setLimit] = useState(10); // 10 / 30 / 50

  useEffect(() => {
    dispatch(getForWishingProducts({ page: page, limit: limit }));
  }, [])

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
            Consult all the Wishes!
          </motion.h1>

          <InputMui
            required
            id="outlined-required searchInput"
            width={"50%"}
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

      <article>
        <div className={classes["wishes-grid-container"]}>
          {/* {productsToWish.map(product => ( */}
          {[
            ...productsToWish,
            ...productsToWish,
            ...productsToWish,
            ...productsToWish,

            ...productsToWish,
          ].map(product => (
            <div className={classes["wish-card"]} key={product.slug}>
              <h1>{product.productName}</h1>
              <p>{product.description}</p>
            </div>
          ))}
        </div>

        <Pagination
          count={10}
          page={page}
          shape="rounded"
          onChange={(event, value) => {
            console.log(value);
            // setPage(value);
            // dispatch(getForWishingProducts({ page: value, limit: limit }));
          }}
        />
      </article>
    </section>
  );
}

export default Wishes
