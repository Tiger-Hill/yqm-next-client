"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getProduct } from "@/lib/redux/slices/productSlice";
import { motion } from "framer-motion";

import Image from "next/image";
import ButtonMui from "@/components/forms/ButtonMui";

import PinIcon from "@mui/icons-material/Pin";
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import classes from "./WishShow.module.scss";

const WishShow = ({ lng, wishSlug }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { productToShow } = useSelector(state => state.rootReducer.product);

  useEffect(() => {
    dispatch(getProduct(wishSlug));
  }, []);

  // ! SET BIG IMAGE HANDLER
  const [selectedImage, setSelectedImage] = useState(0);
  const setBigImageHandler = imageIndex => {
    setSelectedImage(imageIndex);
  };

  return (
    <section className={classes["wish-show-container"]}>
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

              {productToShow.images[1] &&
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
              }

              {productToShow.images[2] &&
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
              }

              {productToShow.images[3] &&
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
              }
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.5 * 0.1 }}
            >
              <Image
                className={classes["main_image"]}
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
              <p className={classes["description"]}>
                {productToShow.productDescription}
              </p>

              <div className={classes["icon-details-set"]}>
                <PinIcon />
                <p>Wished by x{productToShow.numberOfWishers} users</p>
              </div>

              <div className={classes["icon-details-set"]}>
                <MonetizationOnRoundedIcon />
                <p>
                  Initial price: ${Number(productToShow.latestPrice).toFixed(2)}{" "}
                  (subject to change)
                </p>
              </div>

              <div className={classes["icon-details-set"]}>
                <TrendingUpIcon />
                <p>
                  Total number of unit wished:{" "}
                  {productToShow.totalQuantityWishedFor}
                </p>
              </div>
            </div>

            <hr />

            {/* <div className={classes["action"]}> */}
            <ButtonMui
              width="100%"
              height="5rem"
              marginTop="0rem"
              fontSize="1.7rem"
              backgroundColor="#7b00ff"
              color="white"
              disabledBakcgroundColor="#DCDCDC"
              disabledColor="white"
              type="submit"
              disabled={false}
              text="Wish for this product"
              onClickHandler={() => {}}
            />
            {/* </div> */}
          </motion.div>
        </>
      )}
    </section>
  );
};

export default WishShow;
