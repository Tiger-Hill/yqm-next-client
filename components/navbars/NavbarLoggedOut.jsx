"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useLayoutEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import classes from "./Navbar.module.scss";
import Link from "next/link";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuToggle from "./MenuToggle";

const NavbarLoggedOut = ({ lng, screenWidth, openSideNav, closeSideNav, isSideNavOpen }) => {
  const dispatch = useDispatch();
  const { basket } = useSelector(state => state.rootReducer.basket);
  const router = useRouter();
  const { t } = useTranslation(lng, "navbar");

  const goHomeHandler = () => {
    router.push(`/${lng}/`);
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

  const navbarClasses = `${classes["navbar-content"]} ${
    scrolled ? classes["with-background"] : ""
  }`;

  // const [navbarHeight, setNavbarHeight] = useState(document && document.querySelector("nav")?.offsetHeight);
  // const [navbarHeight, setNavbarHeight] = useState(0);

  // * We set a navbar-height variable in CSS to the height of the navbar o we can set dynamic 100vh by subtracting the navbar height from the viewport height
  useLayoutEffect(() => {
    const navbarHeight = document.querySelector("nav").offsetHeight;
    document.documentElement.style.setProperty(
      "--navbar-height",
      `${navbarHeight}px`
    );
  }, []);

  // * This handler is triggered when clicking on the cart icon. It redirects to the basket page
  const goToBasketHandler = () => {
    router.push(`/${lng}/basket`);
  };

  // ! This way we don't have a server error because the client and server have different content. We wait for the client before displaying the sopping badge
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, [])

  return (
    <nav className={navbarClasses}>
      <div className={classes["app-logo"]} onClick={goHomeHandler}>
        <Image
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

      {screenWidth >= 930 && (
        <div className={classes["link-containers"]}>
          {/* <Link href={`/${lng}/services`}>{t("loggedOut.ourService")}</Link> */}
          <Link href={`/${lng}/wishes`}>{t("loggedOut.allWishes")}</Link>
          <Link href={`/${lng}/products`}>{t("loggedOut.allProducts")}</Link>
          <Link href={`/${lng}/about`}>{t("loggedOut.aboutUs")}</Link>
          <Link href={`/${lng}/login`} className={classes["auth-link"]}>
            <AccountCircleIcon />
            {/* {t("loggedOut.login")} */}
          </Link>
        </div>
      )}

      {screenWidth < 930 && (
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

      {isClient && (
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
            },
          }}
        >
          <ShoppingCartIcon
            className={classes["cart-icon"]}
            onClick={goToBasketHandler}
          />
        </Badge>
      )}
    </nav>
  );
};

export default NavbarLoggedOut;
