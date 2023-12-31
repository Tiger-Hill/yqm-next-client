"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getProduct } from "@/lib/redux/slices/productSlice";
import { getAllUserWishes } from "@/lib/redux/slices/wishSlice";
import useScreenWidth from "@/hooks/useScreenWidth";
import { motion } from "framer-motion";

import NewWishModal from "@/components/wishes/new/NewWishModal";
import EditWishModal from "@/components/wishes/edit/EditWishModal";
import Image from "next/image";
import ButtonMui from "@/components/forms/ButtonMui";

import PinIcon from "@mui/icons-material/Pin";
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import classes from "./WishShow.module.scss";

const WishShow = ({ lng, wishSlug }) => {
  const dispatch = useDispatch();
  const screenWidth = useScreenWidth();
  const router = useRouter();
  const { productToShow } = useSelector(state => state.rootReducer.product);
  const { isLoggedIn } = useSelector(state => state.rootReducer.auth);
  const { userWishes, notification } = useSelector(state => state.rootReducer.wish);

  // ! We get all the data
  useEffect(() => {
    dispatch(getProduct(wishSlug));
    dispatch(getAllUserWishes());
  }, []);

  // ! We determine if the user already wished for this product
  const [userWish, setUserWish] = useState(null);
  useEffect(() => {
    if (!productToShow || !userWishes) return;

    setUserWish(userWishes.find(
      wish => wish.product.slug === productToShow.slug
    ));

  }, [productToShow, userWishes])

  useEffect(() => {
    if (!notification.flash_code) return;

    if (notification.flash_code === "CREATE_WISH_SUCCESS") {
      dispatch(getProduct(productToShow.slug));
    }

  }, [notification.flash_code])

  // ! SET BIG IMAGE HANDLER
  const [selectedImage, setSelectedImage] = useState(0);
  const setBigImageHandler = imageIndex => setSelectedImage(imageIndex);

  // ! WHEN THE USER IS NOT LOGGED IN
  const redirectToLoginPageHandler = () => router.push(`/${lng}/login`);

  // ! OPEN/CLOSE NEW WISH MODAL HANDLER
  const [showNewWishModal, setShowNewWishModal] = useState(false);
  const openNewWishModalHandler = () => setShowNewWishModal(true);
  const closeNewWishModalHandler = () => setShowNewWishModal(false);

  // ! OPEN/CLOSE EDIT WISH MODAL HANDLER
  const [showEditWishModal, setShowEditWishModal] = useState(false);
  const openEditWishModalHandler = () => setShowEditWishModal(true);
  const closeEditWishModalHandler = () => setShowEditWishModal(false);

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

              {userWish && (
                <p className={classes["is-user-wish-msg"]}>
                  You already wished this product to be orderable!
                </p>
              )}
            </div>

            <hr />

            {!isLoggedIn && (
              <ButtonMui
                width="100%"
                height="5rem"
                marginTop="0rem"
                fontSize="1.7rem"
                backgroundColor="#3CA94E"
                color="white"
                disabledBakcgroundColor="#DCDCDC"
                disabledColor="white"
                type="button"
                disabled={false}
                text="Login to make a wish"
                onClickHandler={() => redirectToLoginPageHandler()}
              />
            )}

            {isLoggedIn && !userWish && (
              <ButtonMui
                width="100%"
                height="5rem"
                marginTop="0rem"
                fontSize="1.7rem"
                backgroundColor="#7b00ff"
                color="white"
                disabledBakcgroundColor="#DCDCDC"
                disabledColor="white"
                type="button"
                disabled={false}
                text="Wish for this product"
                onClickHandler={() => openNewWishModalHandler()}
              />
            )}

            {/* // ! NEW WISH MODAL */}
            {showNewWishModal && (
              <NewWishModal
                closeModal={closeNewWishModalHandler}
                lng={lng}
                product={productToShow}
                // basket={productToShow}
              />
            )}

            {isLoggedIn && userWish && (
              <ButtonMui
                width="100%"
                height="5rem"
                marginTop="0rem"
                fontSize="1.7rem"
                backgroundColor="#7b00ff"
                color="white"
                disabledBakcgroundColor="#DCDCDC"
                disabledColor="white"
                type="button"
                disabled={false}
                text="Edit my wish"
                onClickHandler={() => openEditWishModalHandler()}
              />
            )}
            {/* // ! NEW WISH MODAL */}
            {showEditWishModal && (
              <EditWishModal
                closeModal={closeEditWishModalHandler}
                lng={lng}
                product={productToShow}
                userWish={userWish}
                // basket={productToShow}
              />
            )}
          </motion.div>
        </>
      )}
    </section>
  );
};

export default WishShow;
