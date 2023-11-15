import Image from "next/image";
import ButtonMui from "@/components/forms/ButtonMui";
import classes from "./Products.module.scss";

const ProductToOrder = ({ product }) => {
  return (
    <div
      className={classes["product-to-order"]}
      onClick={() => alert("OPEN ADD ORDER MODAL")}
    >
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
        <p>Now available for order</p>

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
            onClickHandler={() => alert("OPEN ADD WISH MODAL")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductToOrder;
