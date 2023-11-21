"use client";

import { useState } from "react";
import OrderConfirmationModal from "./OrderConfirmationModal";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import classes from "./AllOrders.module.scss";

const OrderActions = ({ order }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const showOrderConfirmationModal = () => setShowConfirmationModal([true, "confirmation"]);
  const showOrderCancellationModal = () => setShowConfirmationModal([true, "cancellation"]);
  const closeOrderConfirmationModal = () => setShowConfirmationModal(false);

  return (
    <td className={classes["actions"]}>
      <DoneIcon className={classes["accept-icon"]} onClick={() => showOrderConfirmationModal()} />
      <CancelIcon className={classes["deny-icon"]} onClick={() => showOrderCancellationModal()} />

      { showConfirmationModal &&
        <OrderConfirmationModal
          closeOrderConfirmationModal={closeOrderConfirmationModal}
          type={showConfirmationModal[1]}
          order={order}
        />
      }
    </td>
  );
};

export default OrderActions;
