"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

import NewProductForm from "./NewProductForm";
import EditProductForm from "./EditProductForm";

const ProductModal = ({ action, showNewProductModalHandler, showEditProductModalHandler, product }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <>
          {action === "new" && createPortal(<NewProductForm showNewProductModalHandler={showNewProductModalHandler} />, document.body)}
          {action === "edit" && createPortal(<EditProductForm product={product} showEditProductModalHandler={showEditProductModalHandler} />, document.body)}
        </>
      )}
    </>
  );
};

export default ProductModal
