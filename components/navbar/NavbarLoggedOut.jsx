import { useState, useEffect, useLayoutEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import classes from "./Navbar.module.scss"
import Link from "next/link"

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const NavbarLoggedOut = ({ t, lng}) => {
  // const router = useRouter()

  // const goHomeHandler = () => {
  //   router.push("/")
  // };

  // const [scrolled, setScrolled] = useState(false);
  // const currentPath = usePathname();

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  // const handleScroll = () => {
  //   if (window.scrollY > 0) {
  //     setScrolled(true);
  //   } else {
  //     setScrolled(false);
  //   }
  // };

  // const navbarClasses =
  // `${classes["navbar-content"]} ${scrolled ? classes["with-background"] : ""}`;

  // const [navbarHeight, setNavbarHeight] = useState(document && document.querySelector("nav")?.offsetHeight);
  // const [navbarHeight, setNavbarHeight] = useState(0);

  // * We set a navbar-height variable in CSS to the height of the navbar o we can set dynamic 100vh by subtracting the navbar height from the viewport height
  useLayoutEffect(() => {
    const navbarHeight = document.querySelector("nav").offsetHeight;
    document.documentElement.style.setProperty("--navbar-height", `${navbarHeight}px`);
  }, []);

  return (
    <nav className={classes["navbar-content"]}>
      <div className={classes["navbar-text"]}>
        <h3>一起买</h3>
        <h4>一起省出一个亿</h4>
      </div>

      <div className={classes["navbar-icons"]}>
        <ShoppingCartIcon />
        <AccountCircleIcon />
      </div>
    </nav>
  );
}

export default NavbarLoggedOut
