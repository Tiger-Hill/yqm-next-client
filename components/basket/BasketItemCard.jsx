"use client";

import { useDispatch } from "react-redux";
import { removeFromLocalBasket } from "@/lib/redux/slices/basketSlice";
import Image from "next/image";
import classes from "./BasketItemCard.module.scss";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";


const BasketItemCard = ({ item }) => {
  const dispatch = useDispatch();

  console.log("item", item);

  const deleteHandler = () => {
    dispatch(removeFromLocalBasket({ product: item.product }));
  };

  return (
    <div className={classes["item-card"]}>
      <div className={classes["card-content-flex"]}>
        <Image src={`${process.env.NEXT_PUBLIC_API_URL}${item.product.images[0]}`} alt="gold coin" width={100} height={70} />

        <div>
          <h4>{item.product.productName}</h4>

          <span
            className={`${classes["item-status"]} ${item.product.productStatus === "in stock" ? classes["available"] : classes["unavailable"]}`}
          >
            {item.product.productStatus}
          </span>
          <p>{item.product.productDescription}</p>

          <div className={classes["card-bottom"]}>
            <p>
              <strong>
                <span className={classes["quantity"]}>{item.quantity}</span> x{" "}
                <span className={classes["price"]}>{Number(item.product.latestPrice).toFixed(2)}</span> ={" "}
                <span className={classes["total"]}>
                  {Number(item.quantity * item.product.latestPrice).toFixed(2)}
                </span>
              </strong>
            </p>

            <DeleteForeverIcon
              className={classes["delete-icon"]}
              onClick={deleteHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasketItemCard
