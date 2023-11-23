"use client";

import { useState, useEffect, useLayoutEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "@/lib/redux/slices/authSlice";
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import classes from "./Navbar.module.scss"
import Link from "next/link"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useTranslation } from "@/app/i18n/client";
import ButtonMui from "@/components//forms/ButtonMui";
import Badge from "@mui/material/Badge";

import MenuToggle from "./MenuToggle";
import { getUserDetails } from "@/lib/redux/slices/userDetailSlice";


const NavbarLoggedIn = ({ lng, screenWidth, openSideNav, closeSideNav, isSideNavOpen }) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.rootReducer.userDetail);
  const { basket } = useSelector((state) => state.rootReducer.basket);
  const { userType } = useSelector((state) => state.rootReducer.auth.user);
  const router = useRouter()
  const { t } = useTranslation(lng, "navbar");

  const goHomeHandler = () => {
    router.push(`/${lng}/`)
  };

  const [scrolled, setScrolled] = useState(false);
  const currentPath = usePathname();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const navbarClasses =
  `${classes["navbar-content"]} ${scrolled ? classes["with-background"] : ""}`;

  // * We set a navbar-height variable in CSS to the height of the navbar o we can set dynamic 100vh by subtracting the navbar height from the viewport height
  useLayoutEffect(() => {
    const navbarHeight = document.querySelector("nav").offsetHeight;
    document.documentElement.style.setProperty("--navbar-height", `${navbarHeight}px`);
  }, []);

  // * This handler is triggered when clicking on the cart icon. It redirects to the basket page
  const goToBasketHandler = () => {
    router.push(`/${lng}/basket`)
  };

  const logOutHandler = () => {
    dispatch(signOut());
    router.replace(`/${lng}/`);
  };

  useEffect(() => {
    !userDetails && dispatch(getUserDetails());
  }, [userDetails]);

  return (
    <nav className={navbarClasses}>
      <div className={classes["app-logo"]}>
        <Image
          onClick={goHomeHandler}
          src="/LOGOS/YQM-logo.svg"
          alt="YQM colored logo"
          width={100}
          height={70}
        />

        <div
          className={`${classes.slogan} ${
            scrolled ? classes["slogan-black"] : classes["slogan-white"]
          } `}
        >
          <h2>Buy Together</h2>
          <h3>Save 100 million together</h3>
        </div>
      </div>

      {screenWidth >= 1300 && (
        <div className={classes["link-containers"]}>
          <Link href={`/${lng}/wishes`}>{t("loggedIn.allWishes")}</Link>
          <Link href={`/${lng}/products`}>{t("loggedIn.allProducts")}</Link>
          <Link href={`/${lng}/user-wish-list`}>{t("loggedIn.userWishList")}</Link>
          <Link href={`/${lng}/orders`}>{t("loggedIn.orders")}</Link>
          <Link href={`/${lng}/account`}>{t("loggedIn.account")}</Link>
          {userType === "Admin" && (
            <Link href={`/${lng}/admin_dashboard`}>
              {t("loggedIn.adminDashboard")}
            </Link>
          )}

          <ButtonMui
            width="fit-content"
            height="3rem"
            fontSize="1.7rem"
            backgroundColor="#FF302E"
            color="white"
            type="button"
            text="Log out"
            onClickHandler={logOutHandler}
          />
        </div>
      )}

      {screenWidth < 1300 && (
        <div
          className={classes["navbar-toggle"]}
          data-testid="side-nav-toggler"
        >
          <MenuToggle
            isScrolled={scrolled}
            openSideNav={openSideNav}
            closeSideNav={closeSideNav}
            isOpen={isSideNavOpen}
          />
        </div>
      )}

      <Badge
        badgeContent={basket.reduce((acc, product) => {
          return acc + product.quantity;
        }, 0)}
        color="primary"
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: "white",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#f8ae01",
            border: `2px solid ${scrolled ? "black" : "white"}`,
            filter: "drop-shadow(0 0 10px rgba(var(--black), 0.25))",
          },
        }}
      >
        <ShoppingCartIcon
          sx={{
            filter: "drop-shadow(0 0 10px rgba(var(--black), 0.75))",
          }}
          className={classes["cart-icon"]}
          onClick={goToBasketHandler}
        />
      </Badge>
    </nav>
  );
}

export default NavbarLoggedIn
