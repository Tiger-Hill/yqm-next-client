import LoginForm from "@/components/auth/LoginForm"
import classes from "@/components/auth/LoginForm.module.scss";

const LoginPage = ({ params: { lng }}) => {
  console.log("lng", lng);
  return (
    <LoginForm lng={lng}/>
  )
}

export default LoginPage
