import loginImg from "../assets/Images/login.webp"
import Template from "../components/core/Auth/Template"

function Login() {
  return (
    <Template
      title="Hey"
      description1="Are you ready? To restart your career."
      description2="Please Enter your email & password..."
      image={loginImg}
      formType="login"
    />
  )
}

export default Login