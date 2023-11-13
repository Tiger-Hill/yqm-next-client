import ResendConfirmationInstructionsForm from "@/components/auth/users/resend-confirmation-instructions/ResendConfirmationInstructionsForm";

const ForgotPasswordPage = ({ params: { lng } }) => {
  return (
    <ResendConfirmationInstructionsForm lng={lng} />
  );
};

export default ForgotPasswordPage;
