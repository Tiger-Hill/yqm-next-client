import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Image from "next/image";
import classes from "./Wishes.module.scss";

import EditIcon from "@mui/icons-material/Edit";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const WishCard = ({ product, index, lng }) => {

  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescriptionVisibilityHandler = () => {
    setShowFullDescription(prevState => !prevState);
  };

  const deleteProductHandler = () => {
    dispatch(deleteProduct(product.slug));
  };

  return (
    <motion.div
      className={classes["wish-card"]}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
        alt={product.productName}
        width={50}
        height={50}
      />

      <div className={classes["product-details"]}>
        <section className={classes["container-top"]}>
          <div>
            <p className={classes["product-name"]}>
              {product.productName}
            </p>

            <div className={classes["prices-container"]}>
              <p className={`${classes["product-price"]} ${!product.latestPrice ? classes["price-missing"] : ""}`}>
                Creator price: {product.priceCurrency} {Number(product.productCreatorPrice).toFixed(2)}
              </p>
              {product.latestUnpublishedPrice &&
                <p className={`${classes["product-price"]} ${classes["unpublished-price"]}`}>
                  U. {product.priceCurrency} {Number(product.latestUnpublishedPrice).toFixed(2)}
                </p>
              }
            </div>
          </div>

          <span className={`${classes["product-status"]} ${classes["client-wish"]}`}>
            {product.productStatus}
          </span>
        </section>

        <motion.div
          className={classes["description-action-container"]}
          initial={ showFullDescription ? {height: "5rem"} : {height: "auto"} }
          animate={ showFullDescription ? {height: "auto"} : {height: "5rem"} }
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
          className={`${classes["add-price-icon"]} ${!product.latestPrice ? classes["price-missing"] : ""}`}
          onClick={() => showNewPriceModalHandler("open")}
        />

        {showFullDescription ?
          <VisibilityOffIcon
            className={classes["hide-description-icon"]}
            onClick={toggleDescriptionVisibilityHandler}
          />
          :
          <RemoveRedEyeIcon
            className={classes["show-description-icon"]}
            onClick={toggleDescriptionVisibilityHandler}
          />
        }

        {!product.latestPrice &&
          <DeleteForeverIcon
            className={classes["delete-icon"]}
            onClick={deleteProductHandler}
          />
        }
      </div>
    </motion.div>
  );
};

export default WishCard;
