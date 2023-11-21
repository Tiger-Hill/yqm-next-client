import Image from "next/image"
import classes from "./HomeHeader.module.scss"

const HomeHeader = ({ lng }) => {
  return (
    <header className={classes["home-header"]}>
      <Image
        src="/IMGS/yqm-header.jpg"
        alt="A man looking towards a mountain. We can see a city in between bathed in sunset light."
        width={4000}
        height={4000}
        // layout="responsive"
      />

      <div className={classes["home-header-content"]}>
        <h1>YQM</h1>
        <h2>Buy together, Save 100 million together</h2>
        {/* <p>YQM is a platform that allows you to wish for products only available in China. Once the demand is high enough, we'll make it possible to order these products.</p> */}
        </div>
    </header>
  );
}

export default HomeHeader
