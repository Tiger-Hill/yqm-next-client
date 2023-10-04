import { TrendingUpSharp } from "@mui/icons-material";
import ButtonMUI from "../buttons/ButtonMUI";
import classes from "./HomeContent.module.scss";

const HomeContent = () => {
  return (
    <div className={classes["home-container"]}>
      <section className={classes["wish-container"]}>
        <div className={classes["items-box"]}>
          <h3>你想要的</h3>
        </div>
        <ButtonMUI
          width={"30%"}
          height={"5rem"}
          color={"white"}
          borderRadius={"5rem"}
          backgroundColor={"#7b00ff"}
          text={"即将上线"}
          type={"button"}
          disabled={false}
        />
      </section>

      <section className={classes["available-product-container"]}>
        <div className={classes["items-box"]}>
          <h3>我来满足</h3>
        </div>
        <ButtonMUI
          width={"30%"}
          height={"5rem"}
          color={"white"}
          borderRadius={"5rem"}
          backgroundColor={"#f8ae01"}
          text={"即将上线"}
          type={"button"}
          disabled={false}
        />
      </section>
    </div>
  );
};

export default HomeContent;
