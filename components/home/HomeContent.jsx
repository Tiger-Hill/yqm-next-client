import classes from "./HomeContent.module.scss";

const HomeContent = () => {
  return (
    <div className={classes["home-container"]}>
      <section className={classes["wish-container"]}>
        <div className={classes["items-box"]}></div>
      </section>

      <section className={classes["available-product-container"]}>
        <div className={classes["items-box"]}></div>
      </section>
    </div>
  );
}

export default HomeContent
