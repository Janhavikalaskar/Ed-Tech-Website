import signupImg from "../assets/Images/signup.webp"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <Template
      title=" Unlock a World of Possibilities!"
      // description1="Embark on a seamless journey by signing up today"
      description2="Your adventure begins with just a few clicks sign up now and be part of something extraordinary!"
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup