import SignupForm from "@/components/auth/SignupForm"

const SignupPage = ({ params: { lng }}) => {
  return <SignupForm lng={lng} />;
}

export default SignupPage
