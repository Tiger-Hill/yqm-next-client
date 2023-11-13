"use client";

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import useScreenWidth from "@/hooks/useScreenWidth";

import NavbarLoggedOut from "./NavbarLoggedOut";
import NavbarLoggedIn from "./NavbarLoggedIn";
import SideNavModal from "./SideNav";

const Polynav = ({ lng }) => {
  const screenWidth = useScreenWidth();

  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const openSideNavHandler = () => {
    setIsSideNavOpen(true);
  };

  const closeSideNavHandler = () => {
    setIsSideNavOpen(false);
  };

  // ! We close the side nav as soon as the viewport is >= 700px
  useEffect(() => {
    if (screenWidth >= 800) {
      setIsSideNavOpen(false);
    }
  }, [screenWidth])

  // ! WE DEFINE THE HEIGHT OF THE VIEWPORT TO BE THE HEIGHT OF THE WINDOW SO 100vh WORKS ON ALL DEVICES
  useEffect(() => {
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--app-height", `${window.innerHeight}px`);
    };

    window.addEventListener("resize", appHeight);
    appHeight();

    return () => {
      window.removeEventListener("resize", appHeight);
    };
  });

  const [isServer, setIsServer] = useState(true);
  useEffect(() => {
    setIsServer(false);
  }, []);

  const userType = useSelector(state => state.rootReducer.auth.user?.userType) || "Anonymous";

  return (
    <>
      {!isServer && userType !== "Anonymous" ?
        <NavbarLoggedIn
          lng={lng}
          screenWidth={screenWidth}
          openSideNav={openSideNavHandler}
          closeSideNav={closeSideNavHandler}
          isSideNavOpen={isSideNavOpen}
        />
        :
        <NavbarLoggedOut
          lng={lng}
          screenWidth={screenWidth}
          openSideNav={openSideNavHandler}
          closeSideNav={closeSideNavHandler}
          isSideNavOpen={isSideNavOpen}
        />
      }

      <AnimatePresence>
        {isSideNavOpen && (
          <SideNavModal
            lng={lng}
            userType={userType}
            openSideNav={openSideNavHandler}
            closeSideNav={closeSideNavHandler}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Polynav
