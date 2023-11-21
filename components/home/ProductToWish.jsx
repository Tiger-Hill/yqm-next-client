import { useRouter } from "next/navigation";

import Image from "next/image";
import ButtonMui from "@/components/forms/ButtonMui";
import SwitchAccessShortcutAddIcon from '@mui/icons-material/SwitchAccessShortcutAdd';

import classes from "./Products.module.scss";

const ProductToWish = ({ product, lng }) => {
  const router = useRouter();

  const goToShowPageHandler = () => {
    router.push(`/${lng}/wishes/${product.slug}`);
  }

  return (
    <div className={classes["product-to-wish"]}>
      {/* <div className={classes["product-details"]}> */}
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
          alt={product.productName}
          width={100}
          height={100}
        />
      {/* </div> */}


      <div className={classes["wish-details"]}>
        <h4>{product.productName}</h4>

        <p>Wished <span className={classes["number-of-wishes"]}>{product.totalQuantityWishedFor}</span> times!</p>

        <div className={classes["actions"]}>
          <ButtonMui
            width="100%"
            height="2.5rem"
            marginTop="0rem"
            fontSize="1.5rem"
            backgroundColor="#7b00ff"
            color="white"
            disabledBakcgroundColor="#DCDCDC"
            disabledColor="white"
            type="button"
            disabled={false}
            text="See product"
            onClickHandler={goToShowPageHandler}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductToWish
