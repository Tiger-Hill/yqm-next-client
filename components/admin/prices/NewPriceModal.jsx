"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

import NewPriceForm from "./NewPriceForm";

const NewPriceModal = ({ showNewPriceModalHandler, product }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted &&
        createPortal(
          <NewPriceForm
            product={product}
            showNewPriceModalHandler={showNewPriceModalHandler}
          />,
          document.body
        )}
    </>
  );
};

export default NewPriceModal
