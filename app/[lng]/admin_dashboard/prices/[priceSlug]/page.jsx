import PageTemplate from "@/components/UI/PageTemplate";
import EditPriceForm from "@/components/admin/prices/EditPriceForm";
import editPrice from "@/public/SVGS/edit.svg";

const EditPricePage = ({ params: {lng, priceSlug }}) => {

  console.log("priceSlug", priceSlug);
  console.log("lng", lng);

  return (
    <PageTemplate
      pageImg={editPrice}
      pageImgAlt={"A plus sign over a document that represents a new order"}
    >
      <h2>
        Manage price
        <br />
        {priceSlug}
      </h2>

      <EditPriceForm lng={lng} priceSlug={priceSlug} />
    </PageTemplate>
  );
};

export default EditPricePage;
