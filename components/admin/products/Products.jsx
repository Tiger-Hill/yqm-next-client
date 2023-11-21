"use client";

import { useState, useEffect, useLayoutEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAdminProducts } from "@/lib/redux/slices/adminSlice";
import { useRouter } from "next/navigation"

import ProductModal from "./ProductModal";
import ProductCard from "./ProductCard";
import ButtonMui from "@/components/forms/ButtonMui";

import classes from "./../AdminDashboard.module.scss";
import AddIcon from "@mui/icons-material/Add";

const Products = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { products } = useSelector(state => state.rootReducer.admin)

  useLayoutEffect(() => {
    dispatch(getAdminProducts())
  }, [])

  const [showNewProductModal , setShowNewProductModal] = useState(false)
  const showNewProductModalHandler = (action) => {
    if (action === "open") {
      setShowNewProductModal(true)
    } else if (action === "close") {
      setShowNewProductModal(false);
    }
  }

  return (
    <div className={classes["products-container"]}>
      <h3>Products</h3>

      {products &&
        products.map((product, i) => (
          <ProductCard key={product.productName} product={product} index={i} />
        ))}

      <div className={classes["add-product-button"]}>
        <AddIcon
          className={classes["add-product-button"]}
          onClick={() => showNewProductModalHandler("open")}
        />

        {showNewProductModal && <ProductModal action={"new"} showNewProductModalHandler={showNewProductModalHandler} />}
        {/* <ButtonMui
          width="100%"
          height="5rem"
          marginTop="2rem"
          fontSize="1.7rem"
          backgroundColor="#3CA94E"
          color="white"
          disabledBakcgroundColor="#DCDCDC"
          disabledColor="white"
          type="submit"
          disabled={false}
          text={
            <span className="flex justify-center align-center">
              <AddIcon style={{ width: "3rem", height: "3rem" }} /> Add A New Product
            </span>
          }
          onClickHandler={() => {}}
        /> */}
      </div>
    </div>
  );
}

export default Products
