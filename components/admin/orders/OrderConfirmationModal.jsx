"use client";

import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { markOrderAsCompleted, markOrderAsCancelled } from "@/lib/redux/slices/adminSlice";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";

import modalClasses from "@/components/modals/Modal.module.scss";

const ConfirmationContent = ({ closeOrderConfirmationModal, order }) => {
  const dispatch = useDispatch();
  const markAsCompletedHandler = () => dispatch(markOrderAsCompleted(order.slug));

  return (
    <motion.div
      className={modalClasses.backdrop}
      onClick={closeOrderConfirmationModal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className={modalClasses["confirmation-content"]}
        onClick={e => e.stopPropagation()}
        initial={{ y: 150 }}
        animate={{ y: 0 }}
        exit={{ y: 150 }}
        transition={{ duration: 0.25 }}
      >
        <CloseIcon
          className={modalClasses["close-icon"]}
          onClick={closeOrderConfirmationModal}
        />
        <Image
          src="/SVGS/question-mark.svg"
          alt="question mark icon for 'are you sure?'"
          width={100}
          height={100}
        />
        <h4>
          Are you sure you want to mark this order as{" "}
          <span className={modalClasses["success-text"]}>completed</span>?
          <br />
          <span className={modalClasses["object-reference"]}>
            (Ref: {order.slug})
          </span>
        </h4>

        <div className={modalClasses["actions"]}>
          <DoneIcon
            className={modalClasses["accept-icon"]}
            onClick={() => markAsCompletedHandler(order.slug)}
          />
          <CancelIcon
            className={modalClasses["deny-icon"]}
            onClick={closeOrderConfirmationModal}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

const CancellationContent = ({ closeOrderConfirmationModal, order }) => {
  const dispatch = useDispatch();
  const markAsCancelledHandler = () => dispatch(markOrderAsCancelled(order.slug));

  return (
    <motion.div
      className={modalClasses.backdrop}
      onClick={closeOrderConfirmationModal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className={modalClasses["confirmation-content"]}
        onClick={e => e.stopPropagation()}
        initial={{ y: 150 }}
        animate={{ y: 0 }}
        exit={{ y: 150 }}
        transition={{ duration: 0.25 }}
      >
        <CloseIcon
          className={modalClasses["close-icon"]}
          onClick={closeOrderConfirmationModal}
        />
        <Image
          src="/SVGS/question-mark.svg"
          alt="question mark icon for 'are you sure?'"
          width={100}
          height={100}
        />
        <h4>
          Are you sure you want to mark this order as{" "}
          <span className={modalClasses["error-text"]}>cancelled</span>?
          <br />
          <span className={modalClasses["object-reference"]}>
            (Ref: {order.slug})
          </span>
        </h4>

        <div className={modalClasses["actions"]}>
          <DoneIcon
            className={modalClasses["accept-icon"]}
            onClick={() => markAsCancelledHandler(order.slug)}
          />
          <CancelIcon
            className={modalClasses["deny-icon"]}
            onClick={closeOrderConfirmationModal}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

const OrderConfirmationModal = ({ closeOrderConfirmationModal, order, type }) => {
  // * type = "cancellation" or "confirmation"
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted &&
        type === "confirmation" &&
        createPortal(
          <ConfirmationContent
            order={order}
            closeOrderConfirmationModal={closeOrderConfirmationModal}
          />,
          document.body
        )}

      {mounted &&
        type === "cancellation" &&
        createPortal(
          <CancellationContent
            order={order}
            closeOrderConfirmationModal={closeOrderConfirmationModal}
          />,
          document.body
        )}
    </>
  );
};

export default OrderConfirmationModal;
