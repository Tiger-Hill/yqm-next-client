import PageTemplate from "@/components/UI/PageTemplate"
import Confirmation from "@/components/users/confirmation/Confirmation";
import success from "@/public/SVGS/success.svg";

const ConfirmationPage = ({ params: { lng } }) => {
  return (
    <PageTemplate pageImg={success} pageImgAlt={"A certificate for confirmation success"} >

    <Confirmation lng={lng} />

    </PageTemplate>
  );
}

export default ConfirmationPage
