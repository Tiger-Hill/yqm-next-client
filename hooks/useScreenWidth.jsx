"use client";

import { useState, useEffect } from "react";

const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState(null);

  useEffect(() => {
    if (window !== undefined) {
      setScreenWidth(window.innerWidth);
    }
  })

  useEffect(() => {
    // * Update the screen width whenever the window is resized
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // * Add a resize event listener and call handleResize
    window.addEventListener("resize", handleResize);

    // * Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // * Use an empty dependency array to run the effect only once on mount

  return screenWidth;
};

export default useScreenWidth;
