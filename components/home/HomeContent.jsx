import { TrendingUpSharp } from "@mui/icons-material";
import ButtonMUI from "../buttons/ButtonMUI";
import classes from "./HomeContent.module.scss";

import HomeHeader from "./HomeHeader";
import ProductList from "@/components/home/ProductList";

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
