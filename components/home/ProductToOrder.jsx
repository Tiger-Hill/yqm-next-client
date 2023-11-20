import { useRouter } from "next/navigation";

import Image from "next/image";
import ButtonMui from "@/components/forms/ButtonMui";
import classes from "./Products.module.scss";

const ProductToOrder = ({ product, lng }) => {
  const router = useRouter();

  const goToShowPageHandler = () => {
    router.push(`/${lng}/products/${product.slug}`);
  }

  return (
    <div className={classes["product-to-order"]}>
      {/* <div className={classes["product-details"]}> */}
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
        alt={product.productName}
        width={100}
        height={100}
      />
      {/* </div> */}
      <div className={classes["product-to-order-details"]}>
        {/* <p>
          Wished{" "}
          <span className={classes["number-of-wishes"]}>
            {product.quantityWishedFor}
          </span>{" "}
          times
        </p> */}
        <h4>{product.productName}</h4>
        <p className={classes["price"]}>SGD {Number(product.latestPrice).toFixed(2)}</p>
        {/* <p className={classes["price"]}>
          SGD {Number(product.latestPrice).toFixed(2)}
        </p> */}

        <div className={classes["actions"]}>
          <ButtonMui
            width="100%"
            height="2.5rem"
            marginTop="0rem"
            fontSize="1.5rem"
            backgroundColor="#f8ae01"
            color="white"
            disabledBakcgroundColor="#DCDCDC"
            disabledColor="white"
            type="button"
            disabled={false}
            text="Order"
            onClickHandler={goToShowPageHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductToOrder;
