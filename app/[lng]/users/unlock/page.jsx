import Unlock from "@/components/users/unlock/Unlock";

// const page = () => {
//   return <Unlock />;
// }

// export default page

// ! IMCOMPLETE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
import PageTemplate from "@/components/UI/PageTemplate"
import Confirmation from "@/components/users/confirmation/Confirmation";
import success from "@/public/SVGS/success.svg";

const UnlockAccount = ({ params: { lng } }) => {
  return (
    <PageTemplate pageImg={success} pageImgAlt={"A certificate for confirmation success"} >

    <Unlock lng={lng} />

    </PageTemplate>
  );
}

export default UnlockAccount
