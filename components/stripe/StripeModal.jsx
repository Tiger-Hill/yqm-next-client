"use client";

import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import StripeEmbededForm from "@/components/stripe/StripeEmbededForm";
import modalClasses from "@/components/modals/Modal.module.scss";


// ! CONTENT
const StripeModalContent = ({ lng, basket, closeDisclaimerModal }) => {
  const backdropRef = useRef(null);

  const closeModalHandler = (e, isCloseButton = false) => {
    if (backdropRef.current === e.target || isCloseButton) {
      closeDisclaimerModal();
    }
  };

  return (
    <div
      className={modalClasses["backdrop"]}
      onClick={e => closeModalHandler(e)}
      data-testid="backdrop-element"
      ref={backdropRef}
    >
      <div className={modalClasses["content"]}>
        {/* <h2 onClick={e => closeModalHandler(e)}>StripeModalContent</h2> */}
        <CloseIcon
          className={modalClasses["close-icon"]}
          onClick={e => closeModalHandler(e, true)}
        />
        <StripeEmbededForm lng={lng} basketData={basket} />
      </div>
    </div>
  );
};

// ! MODAL
const StripeModal = ({ closeDisclaimerModal, lng, basket }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted
    ? ReactDOM.createPortal(
        <StripeModalContent closeDisclaimerModal={closeDisclaimerModal} lng={lng} basket={basket} />,
        document.body
      )
    : null;
};

export default StripeModal;
