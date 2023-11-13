import { motion } from "framer-motion";
import classes from "./Navbar.module.scss";

const Path = ({ isScrolled, isOpen, ...props }) => {
  const defaultVariants = {
    closed: { d: "M 2 2.5 L 20 2.5" },
    open: { d: "M 3 16.5 L 17 2.5" },
  };
  const { variants, ...rest } = props;

  return (
    <motion.path
      animate={isOpen ? "open" : "closed"}
      fill="transparent"
      strokeWidth="3"
      stroke={isScrolled ? "rgb(var(--black))" : "rgb(var(--white))"}
      strokeLinecap="round"
      variants={{ ...defaultVariants, ...variants }}
      {...rest}
    />
  );
};

const MenuToggle = ({ isScrolled, openSideNav, closeSideNav, isOpen }) => (
  <button
    onClick={() => (isOpen ? closeSideNav() : openSideNav())}
    className={classes["toggle-button"]}
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        isOpen={isOpen}
        isScrolled={isScrolled}
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        isOpen={isOpen}
        isScrolled={isScrolled}
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        isOpen={isOpen}
        isScrolled={isScrolled}
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

export default MenuToggle;
