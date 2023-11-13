import PageTemplate from "@/components/UI/PageTemplate";
import NewPasswordForm from "@/components/users/password/NewPasswordForm";
import editPassword from "@/public/SVGS/edit-password.svg";

const EditPasswordPage = ({ params: { lng } }) => {
  return (
    <PageTemplate
      pageImg={editPassword}
      pageImgAlt={"A question mark in a circle"}
    >
      <h2>Reset your Password</h2>

      <NewPasswordForm lng={lng} />
    </PageTemplate>
  );
};

export default EditPasswordPage;
