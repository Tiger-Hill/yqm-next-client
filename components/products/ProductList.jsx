"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getForWishingProducts, getForOrderingProducts } from "@/lib/redux/slices/productSlice";

import ProductToWish from "./ProductToWish";
import ProductToOrder from "./ProductToOrder";

import classes from "./Products.module.scss";

const ProductList = ({ type }) => {
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
          {/* <h2>Trending user wishes</h2> */}
          {[...productsToWish, ...productsToWish].slice(0, -1).map((product, index) => (
            <ProductToWish key={index} product={product} />
          ))}
        </div>
      )}

      {/* // ! PRODUCTS TO ORDER */}
      {type === "productToOrder" && productsToOrder && (
        // <div className={classes["products-to-order"]}>
        //   <h2>Order now!</h2>
        //   {productsToOrder.map((product, index) => (
        //     <ProductToOrder key={index} product={product} />
        //   ))}
        // </div>
        <div className={classes["products-to-order"]}>
          {/* <h2>Trending user wishes</h2> */}
          {productsToOrder.map((product, index) => (
            <ProductToOrder key={index} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
