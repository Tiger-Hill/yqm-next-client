import ReactDOM from "react-dom";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "@/lib/redux/slices/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/app/i18n/client";
import ButtonMui from "@/components//forms/ButtonMui";

import classes from "./SideNavModal.module.scss";
// import classes from "@/components/modals/Modal.module.scss";

const SideNavContent = ({
  lng,
  userType,
  openSideNav,
  closeSideNav,
  closeAuthModal,
  showAuthModal,
}) => {
  //
  const backdropRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const currentPath = usePathname();
  const { t } = useTranslation(lng, "navbar");

  const closeModalHandler = e => {
    if (backdropRef.current === e.target) {
      closeSideNav();
    }
  };

  const logOutHandler = () => {
    dispatch(signOut());
    closeSideNav();
    router.push("/");
  };

  const authActionHandler = () => {
    closeSideNav();
    showAuthModal();
  };

  // * =============================== PUBLIC LINKS ==============================
  const publicLinks = [
    { name: t("loggedIn.allWishes"), path: `/${lng}/wishes`, isActive: false },
    { name: t("loggedIn.allProducts"), path: `/${lng}/products`, isActive: false },
    { name: t("loggedOut.aboutUs"), path: `/${lng}/about`, isActive: false },
    { name: t("loggedOut.login"), path: `/${lng}/login`, isActive: false },
  ];

        // <Link href={`/${lng}/wishes`}>{t("loggedIn.allWishes")}</Link>
        //   <Link href={`/${lng}/products`}>{t("loggedIn.allProducts")}</Link>
        //   <Link href={`/${lng}/user-wish-list`}>{t("loggedIn.wishList")}</Link>
        //   <Link href={`/${lng}/orders`}>{t("loggedIn.orders")}</Link>
        //   <Link href={`/${lng}/account`}>{t("loggedIn.account")}</Link>
        //   {userType === "Admin" && (
        //     <Link href={`/${lng}/admin_dashboard`}>
        //       {t("loggedIn.adminDashboard")}
        //     </Link>
        //   )}

  // * =============================== PRIVATE LINKS ==============================
  // ! IF THIS CHANGES, UPDATE THE VALUE OF THE MOTION DIV FOR THE LOGOUT BUTTON (currently "5")
  const privateLinks = [
    { name: t("loggedIn.allWishes"), path: `/${lng}/wishes`, isActive: false },
    { name: t("loggedIn.allProducts"), path: `/${lng}/products`, isActive: false },
    { name: t("loggedIn.userWishList"), path: `/${lng}/user-wish-list`, isActive: false },
    { name: t("loggedIn.orders"), path: `/${lng}/orders`, isActive: false },
    { name: t("loggedIn.account"), path: `/${lng}/account`, isActive: false },
  ];

  return (
    <motion.div
      className={classes["backdrop-no-nav"]}
      data-testid="backdrop-element"
      ref={backdropRef}
      onClick={e => closeModalHandler(e)}
      key="backdrop"
      transition={{ duration: 0.25 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* // ! USER IS LOGGED OUT // PUBLIC NAVBAR */}
      {userType === "Anonymous" && (
        <div className={classes["side-nav"]} data-testid="side-nav">
          <ul>
            {publicLinks.map((link, index) => {
              return (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    className={currentPath === link.path ? classes.active : ""}
                    href={link.path}
                    onClick={closeSideNav}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}

      {/* // ! USER IS LOGGED IN // PRIVATE NAVBAR */}
      {userType !== "Anonymous" && (
        <div className={classes["side-nav"]} data-testid="side-nav">
          <ul>
            {privateLinks.map((link, index) => {
              return (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    className={currentPath === link.path ? classes.active : ""}
                    href={link.path}
                    onClick={closeSideNav}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              );
            })}

            {userType === "Admin" && (
              <motion.li
                key="adminDashboard"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (privateLinks.length + 1) * 0.1 }} //? We delay the animation by links array length + 1
              >
                <Link
                  className={ currentPath === `/${lng}/admin_dashboard` ? classes.active : "" }
                  href={`/${lng}/admin_dashboard`}
                  onClick={closeSideNav}
                >
                  {t("loggedIn.adminDashboard")}
                </Link>
              </motion.li>
            )}
          </ul>

          <motion.div
            className={classes["logout-button"]}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (privateLinks.length + 1) * 0.1 }} //? We delay the animation by links array length + 1
          >
            <ButtonMui
              width="fit-content"
              height="3rem"
              // marginTop="1rem !important"
              fontSize="1.7rem"
              backgroundColor="#ACACAC"
              color="white"
              // disabledBakcgroundColor="#DCDCDC"
              // disabledColor="white"
              type="button"
              // disabled={formik.errors.email || formik.errors.password}
              text="Log out"
              onClickHandler={logOutHandler}
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const SideNavModal = ({
  lng,
  userType,
  openSideNav,
  closeSideNav,
  closeAuthModal,
  showAuthModal,
}) => {
  return ReactDOM.createPortal(
    <SideNavContent
      lng={lng}
      userType={userType}
      openSideNav={openSideNav}
      closeSideNav={closeSideNav}
      showAuthModal={showAuthModal}
      closeAuthModal={closeAuthModal}
    />,
    document.body
  );
};

export default SideNavModal;
