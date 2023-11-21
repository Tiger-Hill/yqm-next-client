import HomeHeader from "./HomeHeader";
import ProductList from "@/components/home/ProductList";
import classes from "./HomeContent.module.scss";

const HomeContent = ({ lng }) => {
  return (
    <div className={classes["home-container"]}>
      <HomeHeader lng={lng} />

      <ProductList type={"productToWish"} lng={lng} />
      <ProductList type={"productToOrder"} lng={lng} />
    </div>
  );
};

export default HomeContent;
