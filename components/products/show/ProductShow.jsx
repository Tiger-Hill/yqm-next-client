"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserWishes } from "@/lib/redux/slices/wishSlice";
import { addToLocalBasket } from "@/lib/redux/slices/basketSlice";
import { getProduct } from "@/lib/redux/slices/productSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import Image from "next/image";
import ButtonMui from "@/components/forms/ButtonMui";

import InputMui from "@/components/forms/InputMui";
import PinIcon from "@mui/icons-material/Pin";
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import classes from "./ProductShow.module.scss";

const ProductShow = ({ lng, productSlug }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { productToShow } = useSelector(state => state.rootReducer.product);
  const { userWishes } = useSelector(state => state.rootReducer.wish);

  useEffect(() => {
    dispatch(getProduct(productSlug));
    dispatch(getAllUserWishes());
  }, []);

  // ! SET BIG IMAGE HANDLER
  const [selectedImage, setSelectedImage] = useState(0);
  const setBigImageHandler = imageIndex => {
    setSelectedImage(imageIndex);
  };

  // ! We determine if the user initially wished for this product to be available
  const [userWish, setUserWish] = useState(null);
  useEffect(() => {
    if (!productToShow || !userWishes) return;

    setUserWish(userWishes.find(
      wish => wish.product.slug === productToShow.slug
    ));

  }, [productToShow, userWishes])

  // ! Change product quantity handler
  const [quantity, setQuantity] = useState(1);
  const changeQuantityHandler = e => {
    setQuantity(e.target.value);
  };

  console.log(typeof(quantity))

  // ! Add to basket handler
  const addToLocalBasketHandler = () => {
    dispatch(addToLocalBasket({ product: productToShow, quantity: Number(quantity) }));
  };

  return (
    <section className={classes["product-show-container"]}>
      {productToShow && (
        <>
          {/* // ! IMAGES */}
          <div className={classes["product-images"]}>
            <div className={classes["secondary-images-container"]}>
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.5 * 0.1 }}
              >
                <Image
                  className={selectedImage === 0 ? classes["selected"] : ""}
                  onClick={() => setBigImageHandler(0)}
                  src={`${process.env.NEXT_PUBLIC_API_URL}${productToShow.images[0]}`}
                  alt={productToShow.productName}
                  width={150}
                  height={150}
                  key={productToShow.images[0]}
                />
              </motion.div>

              {productToShow.images[1] && (
                <motion.div
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.5 * 0.2 }}
                >
                  <Image
                    className={selectedImage === 1 ? classes["selected"] : ""}
                    onClick={() => setBigImageHandler(1)}
                    src={`${process.env.NEXT_PUBLIC_API_URL}${productToShow.images[1]}`}
                    alt={productToShow.productName}
                    width={150}
                    height={150}
                    key={productToShow.images[1]}
                  />
                </motion.div>
              )}
              {productToShow.images[2] && (
                <motion.div
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.5 * 0.3 }}
                >
                  <Image
                    className={selectedImage === 2 ? classes["selected"] : ""}
                    onClick={() => setBigImageHandler(2)}
                    src={`${process.env.NEXT_PUBLIC_API_URL}${productToShow.images[2]}`}
                    alt={productToShow.productName}
                    width={150}
                    height={150}
                    key={productToShow.images[2]}
                  />
                </motion.div>
              )}

              {productToShow.images[3] && (
                <motion.div
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.5 * 0.4 }}
                >
                  <Image
                    className={selectedImage === 3 ? classes["selected"] : ""}
                    onClick={() => setBigImageHandler(3)}
                    src={`${process.env.NEXT_PUBLIC_API_URL}${productToShow.images[3]}`}
                    alt={productToShow.productName}
                    width={150}
                    height={150}
                    key={productToShow.images[3]}
                  />
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.5 * 0.1 }}
            >
              <Image
                className={classes["main-image"]}
                src={`${process.env.NEXT_PUBLIC_API_URL}${productToShow.images[selectedImage]}`}
                alt={productToShow.productName}
                width={660}
                height={660}
                key={productToShow.images[selectedImage]}
              />
            </motion.div>
          </div>

          {/* // ! DETAILS */}
          <motion.div
            className={classes["product-details"]}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.5 * 0.5 }}
          >
            <div className={classes["description-section"]}>
              <h2>{productToShow.productName}</h2>

              {productToShow.productStatus === "in stock" && (
                <p
                  className={`${classes["product-status"]} ${classes["in-stock"]}`}
                >
                  {productToShow.productStatus}
                </p>
              )}

              {productToShow.productStatus === "out of stock" && (
                <p
                  className={`${classes["product-status"]} ${classes["out-of-stock"]}`}
                >
                  {productToShow.productStatus}
                </p>
              )}

              <p className={classes["description"]}>
                {productToShow.productDescription}
              </p>

              {/* <div className={classes["icon-details-set"]}>
                <PinIcon />
                <p>Wished by x{productToShow.numberOfWishers} users</p>
              </div> */}

              <div className={classes["icon-details-set"]}>
                <MonetizationOnRoundedIcon />
                <p>SGD {Number(productToShow.latestPrice).toFixed(2)} </p>
                <InputMui
                  required
                  marginTop="0rem"
                  id="outlined-required quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max={Infinity}
                  label="Quantity"
                  width={"30%"}
                  // helperText={"Quantity"}
                  onChangeHandler={e => changeQuantityHandler(e)}
                  // onBlurHandler={formik.handleBlur}
                  // error={!!formik.touched.wishPrice && !!formik.errors.wishPrice}
                  // valid={!!formik.touched.wishPrice && !formik.errors.wishPrice}
                  disabled={false}
                  defaultValue={1}
                />
              </div>

              {/* <div className={classes["icon-details-set"]}>
                <TrendingUpIcon />
                <p>
                  Total number of unit wished:{" "}
                  {productToShow.totalQuantityWishedFor}
                </p>
              </div> */}
            </div>

            {userWish && (
              <p className={classes["is-user-wish-msg"]}>
                You initially wished for this product to be available for orders
                the {new Date(userWish.createdAt).toLocaleDateString()}
              </p>
            )}

            <hr />

            {/* <div className={classes["action"]}> */}
            <ButtonMui
              width="100%"
              height="5rem"
              marginTop="0rem"
              fontSize="1.7rem"
              backgroundColor="#f8ae01"
              color="white"
              disabledBakcgroundColor="#DCDCDC"
              disabledColor="white"
              type="submit"
              disabled={false}
              text="Add to basket"
              onClickHandler={addToLocalBasketHandler}
            />
            {/* </div> */}
          </motion.div>
        </>
      )}
    </section>
  );
};

export default ProductShow;
