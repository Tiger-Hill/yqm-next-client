import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import Image from "next/image";
import classes from "./Products.module.scss";

const ProductCard = ({ product, index, lng }) => {
  const router = useRouter();

  const showProductDetailsHandler = productSlug => {
    router.push(`/${lng}/products/${productSlug}`);
  };

  return (
    <motion.div
      onClick={() => showProductDetailsHandler(product.slug)}
      className={classes["product-card"]}
      key={product.slug}
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
        alt={product.productName}
        width={200}
        height={200}
      />
      <h4>
        <span className={classes.price}>${product.latestPrice}</span>
        <br />
        {product.productName}
      </h4>
      <p>{product.description}</p>
    </motion.div>
  );
};

export default ProductCard;
