"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import classes from "../PublicPages.module.scss";

const About = ({ lng }) => {
  return (
    <header className={classes["public-page-header"]}>
      <Image
        src="/IMGS/about.jpg"
        alt="A man looking towards a mountain. We can see a city in between bathed in sunset light."
        width={4000}
        height={4000}
      />

      <div className={classes["header-content"]}>
        <motion.h1
          transition={{ duration: 0.25 }}
          initial={{ opacity: 0, height: "auto" }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: "auto" }}
        >
          About us
        </motion.h1>
      </div>
    </header>
  );
}

export default About
