import { TrendingUpSharp } from "@mui/icons-material";
import ButtonMUI from "../buttons/ButtonMUI";
import classes from "./HomeContent.module.scss";

import HomeHeader from "./HomeHeader";
import ProductList from "@/components/products/ProductList";

const HomeContent = () => {
  return (
    <div className={classes["home-container"]}>
      <HomeHeader />

      <ProductList type={"productToWish"}/>
      <ProductList type={"productToOrder"}/>
    </div>
  );
};

export default HomeContent;
