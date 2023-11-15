import Products from "@/components/products/Products";

const page = ({ params: { lng } }) => {
  return <Products lng={lng} />;
};

export default page;
