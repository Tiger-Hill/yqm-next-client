import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteProduct } from "@/lib/redux/slices/adminSlice";
import { motion } from "framer-motion";

import Image from "next/image";
import ProductModal from "./ProductModal";
import NewPriceModal from "../prices/NewPriceModal";

import classes from "./ProductCard.module.scss";
import EditIcon from "@mui/icons-material/Edit";
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";


const ProductCard = ({ product, index }) => {
  const dispatch = useDispatch();
  let productStatusClass;
  switch (product.productStatus) {
    case "in stock":
      productStatusClass = classes["available"];
      break;
    case "out of stock":
      productStatusClass = classes["unavailable"];
      break;
    case "hidden":
      productStatusClass = classes["hidden"];
      break;
    case "for wishing":
      productStatusClass = classes["for-wishing"];
      break;
  }

  const productStatus = product.productStatus.charAt(0).toUpperCase() + product.productStatus.slice(1)

  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const showEditProductModalHandler = action => {
    if (action === "open") {
      setShowEditProductModal(true);
    } else if (action === "close") {
      setShowEditProductModal(false);
    }
  };

  const [showNewPriceModal, setShowNewPriceModal] = useState(false);
  const showNewPriceModalHandler = (action) => {
    if (action === "open") {
      setShowNewPriceModal(true);
    } else if (action === "close") {
      setShowNewPriceModal(false);
    }
  };

  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescriptionVisibilityHandler = () => {
    setShowFullDescription(prevState => !prevState);
  }

  const deleteProductHandler = () => {
    dispatch(deleteProduct(product.slug));
  };


  return (
    <motion.div
      className={classes["product-card"]}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* // ! There should always be at least one image attached to a product at this point  */}
      <Image
        src={
          product.images.length > 0
            ? `${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`
            : "/IMGS/no-image.png"
        }
        alt={product.productName}
        width={50}
        height={50}
      />
      <div className={classes["product-details"]}>
        <section className={classes["container-top"]}>
          <div>
            <p className={classes["product-name"]}>{product.productName}</p>

            <div className={classes["prices-container"]}>
              <p
                className={`${classes["product-price"]} ${
                  !product.latestPrice ? classes["price-missing"] : ""
                }`}
              >
                {product.priceCurrency} {Number(product.latestPrice).toFixed(2)}
              </p>
              {product.latestUnpublishedPrice && (
                <p
                  className={`${classes["product-price"]} ${classes["unpublished-price"]}`}
                >
                  U. {product.priceCurrency}{" "}
                  {Number(product.latestUnpublishedPrice).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <span
            className={`${classes["product-status"]} ${productStatusClass}`}
          >
            {productStatus}
          </span>
        </section>

        <motion.div
          className={classes["description-action-container"]}
          initial={
            showFullDescription ? { height: "5rem" } : { height: "auto" }
          }
          animate={
            showFullDescription ? { height: "auto" } : { height: "5rem" }
          }
          transition={{ duration: 0.5 }}
        >
          <motion.p className={classes["product-description"]}>
            {product.productDescription}
          </motion.p>
        </motion.div>
      </div>

      <div className={classes["product-actions"]}>
        <EditIcon
          className={classes["edit-icon"]}
          onClick={() => showEditProductModalHandler("open")}
        />
        <PriceChangeIcon
          className={`${classes["add-price-icon"]} ${
            !product.latestPrice ? classes["price-missing"] : ""
          }`}
          onClick={() => showNewPriceModalHandler("open")}
        />

        {showFullDescription ? (
          <VisibilityOffIcon
            className={classes["hide-description-icon"]}
            onClick={toggleDescriptionVisibilityHandler}
          />
        ) : (
          <RemoveRedEyeIcon
            className={classes["show-description-icon"]}
            onClick={toggleDescriptionVisibilityHandler}
          />
        )}

        {!product.latestPrice && (
          <DeleteForeverIcon
            className={classes["delete-icon"]}
            onClick={deleteProductHandler}
          />
        )}
      </div>

      {showEditProductModal && (
        <ProductModal
          action={"edit"}
          product={product}
          showEditProductModalHandler={showEditProductModalHandler}
        />
      )}

      {showNewPriceModal && (
        <NewPriceModal
          product={product}
          showNewPriceModalHandler={showNewPriceModalHandler}
        />
      )}
    </motion.div>
  );
}

export default ProductCard
