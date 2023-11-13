"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getForWishingProducts, getForOrderingProducts } from "@/lib/redux/slices/productSlice";

import Link from "next/link";
import ProductToWish from "./ProductToWish";
import ProductToOrder from "./ProductToOrder";
import ButtonMui from "@/components/forms/ButtonMui";

import AddIcon from "@mui/icons-material/Add";

import classes from "./Products.module.scss";

const ProductList = ({ type, lng }) => {
    const dispatch = useDispatch();
    const { productsToWish, productsToOrder } = useSelector(state => state.rootReducer.product);

    console.log("productsToOrder", productsToOrder);
    useEffect(() => {
      dispatch(getForWishingProducts());
      dispatch(getForOrderingProducts());
    }, []);

  return (
    <section className={classes["products-section"]}>
      {/* // ! PRODUCTS TO WISH */}
      {type === "productToWish" && productsToWish && (
        <div className={classes["products-to-wish"]}>
          {/* <h2>You want</h2> */}
          <h2 className={classes["product-section-title"]}>Trending user wishes</h2>
          {[...productsToWish, ...productsToWish].slice(0, 4).map((product, index) => (
            <ProductToWish key={index} product={product} />
          ))}

          <div className={classes["links"]}>
            <Link href={`/${lng}/wishes`}>See all wishes...</Link>
            <ButtonMui
              width="fit-content"
              height="2.5rem"
              marginTop="0rem"
              fontSize="1.5rem"
              backgroundColor="#7b00ff"
              color="white"
              disabledBakcgroundColor="#DCDCDC"
              disabledColor="white"
              type="button"
              disabled={false}
              text={<><AddIcon />   New Wish</>}
              onClickHandler={() => alert("OPEN ADD WISH MODAL")}
            />
          </div>
        </div>
      )}

      {/* // ! PRODUCTS TO ORDER */}
      {type === "productToOrder" && productsToOrder && (
        <div className={classes["products-to-order"]}>
          <h2 className={classes["product-section-title"]}>Available for order</h2>
          {productsToOrder.map((product, index) => (
            <ProductToOrder key={index} product={product} />
          ))}

          <div className={classes["links"]}>
            <Link href={`/${lng}/orders`}>See all past orders...</Link>
            {/* <ButtonMui
              width="fit-content"
              height="2.5rem"
              marginTop="0rem"
              fontSize="1.5rem"
              backgroundColor="#7b00ff"
              color="white"
              disabledBakcgroundColor="#DCDCDC"
              disabledColor="white"
              type="button"
              disabled={false}
              text={<><SwitchAccessShortcutAddIcon />   New Wish</>}
              onClickHandler={() => alert("OPEN ADD WISH MODAL")}
            /> */}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductList;
