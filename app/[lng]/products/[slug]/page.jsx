import ProductShow from "@/components/products/show/ProductShow";

const ProductShowPage = ({ params: { lng, slug } }) => {
  return <ProductShow lng={lng} productSlug={slug} />;
};

export default ProductShowPage;
