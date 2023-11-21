"use client";

import Image from "next/image"
import { motion } from "framer-motion"

import classes from "./ProductListItem.module.scss"


const ProductListItem = ({ product, setPriceTable }) => {
  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.33 }}
      className={classes["product-item"]}
      onClick={() => setPriceTable(product.slug)}
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}/${product.image}`}
        alt={`Picture of the product ${product.productName}`}
        width={30}
        height={30}
      />
      <p>{product.productName}</p>
    </motion.li>
  );
}

export default ProductListItem
