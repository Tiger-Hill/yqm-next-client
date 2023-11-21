import Basket from "@/components/basket/Basket";

const BasketPage = ({ params: { lng } }) => {
  return <Basket lng={lng}/>;
};

export default BasketPage;
