"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import classes from "./UserWishCard.module.scss";

const UserWishCard = ({ userWish, index }) => {
  return (
    <motion.article
      className={classes["wish-card"]}
      key={userWish.slug}
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div className={classes["wish-card__image"]}>
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}${userWish.product.images[0]}`}
          alt={userWish.product.productName}
          width={"150"}
          height={"150"}
        />
      </div>

      <div className={classes["wish-card__content"]}>
        <h2>{userWish.product.productName}</h2>
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
