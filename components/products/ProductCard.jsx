import Image from "next/image";
import classes from "./Products.module.scss";

const ProductCard = ({ product, index }) => {
  console.log(product);

  return (
    <div className={classes["product-card"]} key={product.slug}>
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
        alt={product.productName}
        width={200}
        height={200}
      />
      <h4>{product.productName}</h4>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductCard;
