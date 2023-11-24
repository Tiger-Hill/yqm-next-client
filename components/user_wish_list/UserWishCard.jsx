"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import classes from "./UserWishCard.module.scss";

const UserWishCard = ({ userWish, index }) => {
  const router = useRouter();

  const goToProduct = (productType) => {
    if (productType === "for wishing") {
      router.push(`/wishes/${userWish.product.slug}`);
    } else {
      router.push(`/products/${userWish.product.slug}`);
    }
  };

  return (
    <motion.article
      onClick={() => goToProduct(userWish.product.productStatus)}
      className={`
        ${classes["wish-card"]}
        ${userWish.product.productStatus === "for wishing" ? classes["wish"] : classes["available-for-order"]}
      `}
      key={userWish.slug}
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div className={classes["wish-card__image"] }>
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}${userWish.product.images[0]}`}
          alt={userWish.product.productName}
          width={"150"}
          height={"150"}
        />
      </div>

      <div className={classes["wish-card__content"]}>
        <h2>{userWish.product.productName}</h2>
        {userWish.product.productStatus !== "for wishing" &&
          <p className={classes["available-flag"]}>
            Available for order
          </p>
        }
        <p>
          You wished for {Number(userWish.wishQuantity).toFixed()} unit
          {Number(userWish.wishQuantity) > 1 ? "s" : ""}.
        </p>
        <p>{new Date(userWish.createdAt).toLocaleDateString()}</p>
      </div>
    </motion.article>
  );
}

export default UserWishCard
