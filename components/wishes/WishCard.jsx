import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import Image from "next/image";
import classes from "./Wishes.module.scss";

const WishCard = ({ product, index, lng }) => {
  const router = useRouter();

  const showProductDetailsHandler = (productSlug) => {
    router.push(`/${lng}/wishes/${productSlug}`);
  }

  return (
    <motion.div
      onClick={() => showProductDetailsHandler(product.slug)}
      className={classes["wish-card"]}
      key={product.slug}

      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
        alt={product.productName}
        width={200}
        height={200}
      />
      <h4>{product.productName}</h4>
    </motion.div>
  );
};

export default WishCard;
