"use client";

import { Fragment } from "react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
// import PaypalButtons from "@/components/paypal/Paypal";
import StripeModal from "@/components/stripe/StripeModal";
import { getBasketProduct, clearBasket } from "@/lib/redux/slices/basketSlice";

import Image from "next/image";
import BasketItemCard from "@/components/basket/BasketItemCard";
import ButtonMui from "@/components/forms/ButtonMui";
import classes from "./Basket.module.scss";

const Basket = ({ lng }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { localBasket, basket } = useSelector(state => state.rootReducer.basket);
  const { isLoggedIn } = useSelector(state => state.rootReducer.auth);
  const { userDetails } = useSelector(state => state.rootReducer.userDetail);
  const [basketTotal, setBasketTotal] = useState(0);
  const maxBasketTotal = useMemo(() => 20_000.0);

  // useEffect(() => {
  //   if (basket) {
  //     setBasketTotal(
  //       basket
  //         .reduce((acc, product) => {
  //           return acc + product.product.latestPrice * product.quantity;
  //         }, 0)
  //         .toFixed(2)
  //     );
  //   }
  // }, [basket]);

  useEffect(() => {
    if (!localBasket || !isLoggedIn || !userDetails) return;

    console.log("CLEARING BASKET");

    dispatch(clearBasket());
    localBasket.forEach(item => dispatch(getBasketProduct(item.productSlug, item.quantity)));
    setTimeout(() => {}, 1000);
  }, [!localBasket, !isLoggedIn, !userDetails]);


  const goToCheckout = () => {
    alert(
      `goToCheckout with ${basket.reduce((acc, product) => {
        return acc + product.quantity;
      }, 0)} items and a total price of ${basket.reduce((acc, product) => {
        return acc + product.product.latestPrice * product.quantity;
      }, 0)}`
    );
  };

  const goToProducts = () => {
    router.push(`/${lng}/products`);
  };

  const goToAccount = () => {
    router.push(`/${lng}/account`);
  };

  const goToLogin = () => {
    router.push(`/${lng}/login`);
  };

  // ! This way we don't have a server error because the client and server have different content. We wait for the client before displaying the sopping badge
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ! STRIPE
  const [showStripeModal, setShowStripeModal] = useState(false);

  const openStripeModal = () => {
    setShowStripeModal(true);
  };

  const closeStripeModal = () => {
    setShowStripeModal(false);
  };

  // console.error("basket", basket);

  return (
    <div className={classes["basket-container"]}>
      {/* <Image src={"/SVGS/cart.svg"} alt="cart svg" width={400} height={400} /> */}

      {isClient && basket && basket.length > 0 && (
        <>
          {isLoggedIn && (
            <div className={classes["cart-sumup"]}>
              <p>
                Total:{" "}
                <span
                  className={`${classes["cart-total"]} ${
                    parseFloat(basketTotal) > maxBasketTotal
                      ? classes["total-exceeds-limit"]
                      : ""
                  }`}
                >
                  SGD{" "}
                  {basket
                    .reduce((acc, product) => {
                      return (
                        acc + product.product.latestPrice * product.quantity
                      );
                    }, 0)
                    .toFixed(2)}
                </span>
              </p>

              {userDetails?.isAllowedToBuy ? (
                <>
                  <ButtonMui
                    width="auto"
                    height="auto"
                    marginTop="0rem"
                    fontSize="1.8rem"
                    backgroundColor="#f8ae01"
                    color="white"
                    disabledBakcgroundColor="#DCDCDC"
                    disabledColor="white"
                    type="button"
                    disabled={parseFloat(basketTotal) > maxBasketTotal}
                    text={"CHECKOUT NOW"}
                    onClickHandler={openStripeModal}
                    // size="large"
                  />

                  {parseFloat(basketTotal) > maxBasketTotal ? (
                    <p className={classes["total-exceeds-limit-message"]}>
                      Your basket total is too high.
                      <br />
                      You can't exceed 20,000.00 SGD.
                      <br />
                      Adjust your basket to proceed to checkout.
                    </p>
                  ) : (
                    <>
                      {/* <PaypalButtons lng={lng} basketData={basket} /> */}
                      {showStripeModal && (
                        <StripeModal
                          closeDisclaimerModal={closeStripeModal}
                          lng={lng}
                          basket={basket}
                        />
                      )}
                    </>
                  )}
                </>
              ) : (
                <ButtonMui
                  width="auto"
                  height="auto"
                  marginTop="0rem"
                  fontSize="1.8rem"
                  backgroundColor="#3CA94E"
                  color="white"
                  disabledBakcgroundColor="#DCDCDC"
                  disabledColor="white"
                  type="button"
                  disabled={false}
                  text={"Complete your profile to checkout"}
                  onClickHandler={goToAccount}
                  // size="large"
                />
              )}
            </div>
          )}

          {!isLoggedIn && (
            <div className={classes["cart-sumup"]}>
              <p>
                Total:{" "}
                <span className={classes["cart-total"]}>
                  SGD{" "}
                  {basket
                    .reduce((acc, product) => {
                      return (
                        acc + product.product.latestPrice * product.quantity
                      );
                    }, 0)
                    .toFixed(2)}
                </span>
              </p>

              <ButtonMui
                width="auto"
                height="auto"
                marginTop="0rem"
                fontSize="1.8rem"
                backgroundColor="#3CA94E"
                color="white"
                disabledBakcgroundColor="#DCDCDC"
                disabledColor="white"
                type="button"
                disabled={false}
                text={"Login to checkout"}
                onClickHandler={goToLogin}
                // size="large"
              />
            </div>
          )}

          <div className={classes["basket-cards-container"]}>
            {basket.map(product => {
              return (
                <Fragment key={product.product.slug}>
                  <BasketItemCard item={product} />
                </Fragment>
              );
            })}
          </div>
        </>
      )}

      {isClient && basket && basket.length === 0 && (
        <>
          <div className={classes["empty-cart"]}>
            <h2>Your cart is empty</h2>
          </div>

          <ButtonMui
            width="auto"
            height="auto"
            marginTop="0rem"
            fontSize="1.8rem"
            backgroundColor="#f8ae01"
            color="white"
            // disabledBakcgroundColor="#DCDCDC"
            // disabledColor="white"
            type="button"
            disabled={false}
            text={"See all products"}
            onClickHandler={goToProducts}
            // size="large"
          />
        </>
      )}
    </div>
  );
};

export default Basket;
