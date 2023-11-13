import ForgotPasswordForm from "@/components/auth/users/forgot-password/ForgotPasswordForm";

const ForgotPasswordPage = ({ params: { lng } }) => {
  return (
    <ForgotPasswordForm lng={lng} />
  );
};

export default ForgotPasswordPage;
