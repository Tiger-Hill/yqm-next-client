"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getForWishingProducts, getForOrderingProducts } from "@/lib/redux/slices/productSlice";

import Link from "next/link";
import ProductToWish from "./ProductToWish";
import ProductToOrder from "./ProductToOrder";

import classes from "./Products.module.scss";

const ProductList = ({ type, lng }) => {
    const dispatch = useDispatch();
    const { productsToWish, productsToOrder } = useSelector(state => state.rootReducer.product);

    console.log("productsToOrder", productsToOrder);
    console.log("productsToWish", productsToWish);
    useEffect(() => {
      dispatch(getForWishingProducts(1)); // 1 = page 1
      dispatch(getForOrderingProducts(1)); // 1 = page 1
    }, []);

  return (
    <section className={classes["products-section"]}>
      {/* // ! PRODUCTS TO WISH */}
      {type === "productToWish" && productsToWish && (
        <div className={classes["products-to-wish"]}>
          <h2 className={classes["product-section-title"]}>Trending user wishes</h2>
          {productsToWish.slice(0, 4).map((product, index) => (
            <ProductToWish key={index} product={product} lng={lng} />
          ))}

          <div className={classes["links"]}>
            <Link href={`/${lng}/wishes`}>See all wishes...</Link>
          </div>
        </div>
      )}

      {/* // ! PRODUCTS TO ORDER */}
      {type === "productToOrder" && productsToOrder && (
        <div className={classes["products-to-order"]}>
          <h2 className={classes["product-section-title"]}>Available for order</h2>
          {productsToOrder.slice(0, 4).map((product, index) => (
            <ProductToOrder key={index} product={product} lng={lng} />
          ))}

          <div className={classes["links"]}>
            <Link href={`/${lng}/products`}>See all products available to order...</Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductList;
