import EditPriceForm from "@/components/admin/prices/EditPriceForm";

const EditPricePage = ({ params: {lng, priceSlug }}) => {
  return <EditPriceForm lng={lng} priceSlug={priceSlug} />;
};

export default EditPricePage;
