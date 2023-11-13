"use client";

// import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import classes from "../PublicPages.module.scss";

const AboutContent = () => {
  const firstBlockRef = useRef(null);
  const isFirstBlockInView = useInView(firstBlockRef, { once: false, amount: 1 });

  const secondBlockRef = useRef(null);
  const isSecondBlockInView = useInView(secondBlockRef, { once: false, amount: 1 });

  const thirdBlockRef = useRef(null);
  const isThirdBlockInView = useInView(thirdBlockRef, { once: false, amount: 1 });

  const fourthBlockRef = useRef(null);
  const isFourthBlockInView = useInView(fourthBlockRef, { once: false, amount: 1 });


  console.log(isSecondBlockInView);
  const variantsLeft = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -100 },
  }

  const variantsRight = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: 100 },
  }

  return (
    <section className={classes["scroll-snap-section"]}>
      <div className={classes["snap-group"]}>
        <div ref={firstBlockRef}/>
        <motion.h2
          transition={{ duration: 0.33 }}
          initial={variantsLeft.hidden}
          animate={isFirstBlockInView ? variantsLeft.visible : variantsLeft.hidden}
        >
          About YQM: Bridging Borders for Your Wishes
        </motion.h2>
        <motion.p
          transition={{ duration: 0.33 }}
          initial={variantsRight.hidden}
          animate={isFirstBlockInView ? variantsRight.visible : variantsRight.hidden}
        >
          Welcome to YQM, where we turn your wishes into reality. At YQM, we
          recognize the challenges that expats face in accessing the latest
          technology and goods from China. Our team, situated across the vibrant
          landscapes of the UK (London), Singapore, and China, is driven by the
          mission to bridge the gap between demand and accessibility.
        </motion.p>
      </div>

      <div className={classes["snap-group"]}>
        <div ref={secondBlockRef} />
        <motion.h2
          transition={{ duration: 0.33 }}
          initial={variantsLeft.hidden}
          animate={isSecondBlockInView ? variantsLeft.visible : variantsLeft.hidden}
        >
          Our Mission: Fulfilling Your Desires
        </motion.h2>
        <motion.p
          transition={{ duration: 0.33 }}
          initial={variantsRight.hidden}
          animate={isSecondBlockInView ? variantsRight.visible : variantsRight.hidden}
        >
          At the heart of YQM's mission is the commitment to empower UK
          residents with the ability to wish for products exclusive to China. We
          understand the frustration of delayed or unfulfilled demands, even
          when there is a clear appetite for these products in the EU. YQM steps
          in as the facilitator, pooling wishes until a critical mass is
          reached, enabling seamless transactions, and ensuring you have timely
          access to the best China has to offer.
        </motion.p>
      </div>

      <div className={classes["snap-group"]}>
        <div ref={thirdBlockRef} />
        <motion.h2
          transition={{ duration: 0.33 }}
          initial={variantsLeft.hidden}
          animate={isThirdBlockInView ? variantsLeft.visible : variantsLeft.hidden}
        >
          How It Works: Simple, Seamless, Satisfying
        </motion.h2>
        <motion.p
          transition={{ duration: 0.33 }}
          initial={variantsRight.hidden}
          animate={isThirdBlockInView ? variantsRight.visible : variantsRight.hidden}
        >
          YQM operates at the intersection of finance and web development,
          utilizing cutting-edge technology to simplify the process. You express
          your wish, and as soon as there's a collective demand, we swing into
          action. From order to delivery, our team ensures a smooth experience,
          with a transparent margin system that guarantees fair transactions.
          Join us on this journey to make global borders feel more like bridges,
          bringing the best of China to your doorstep.
        </motion.p>
      </div>

      <div className={classes["snap-group"]}>
        <div ref={fourthBlockRef} />
        <motion.h2
          transition={{ duration: 0.33 }}
          initial={variantsLeft.hidden}
          animate={isFourthBlockInView ? variantsLeft.visible : variantsLeft.hidden}
        >
          We're based in Singapore
        </motion.h2>

        <motion.p
          transition={{ duration: 0.33 }}
          initial={variantsRight.hidden}
          animate={isFourthBlockInView ? variantsRight.visible : variantsRight.hidden}
        >
          YQM is based in Singapore, a global financial hub. We are located at:
          <br />
          60 Paya Lebar Road #07-54 Paya Lebar Square Singapore 409051
        </motion.p>

        <motion.iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15955.04346178049!2d103.8925563!3d1.3191725!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da198f19efc05d%3A0x14c31eb0f3abc0fe!2sParkway%20Suites!5e0!3m2!1sen!2suk!4v1699890130015!5m2!1sen!2suk"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          transition={{ duration: 0.33 }}
          initial={variantsLeft.hidden}
          animate={isFourthBlockInView ? variantsLeft.visible : variantsLeft.hidden}
        ></motion.iframe>
      </div>
    </section>
  );
};

export default AboutContent;
