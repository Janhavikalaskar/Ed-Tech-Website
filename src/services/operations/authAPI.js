import { toast } from "react-hot-toast"

import {apiConnector} from "../apiConnector";
import { endpoints } from "../api";
import { setLoading, setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import {resetCart} from "../../slices/cartSlice"



//fetching api's through destructuring of endpoints name object
const { SENDOTP_API, SIGNUP_API,LOGIN_API,RESETPASSTOKEN_API, RESETPASSWORD_API,} = endpoints;


//function to call api for sending otp for email verification
export function sendOtp(email,navigate){
    return async (dispatch)=>{

        //show loading toast till sending otp
        const toastId = toast.loading("Loading...")

        //loading state jo redux ki hai usko true update kr rhe hai
        dispatch(setLoading(true))

        try{
            //sending post request 
            const response = await apiConnector("POST",SENDOTP_API,{
                email,
                checkUserPresent:true,
            })
            console.log("SENDOTP API RESPONSE............", response)
            
            //jo request gyi hai agar vo success hoti hai toh console kro
            console.log(response.data.success)

            //agar success nai hoti hai toh error print karo
            if (!response.data.success) {
                throw new Error(response.data.message)
              }

              //otp send hone k baad toast show kro otp sent vala
              toast.success("OTP Sent Successfully")
              //aur navigate kr jao verify email k page par , navigate hook use krke jo pass kia tha
              navigate("/verify-email")
        }
        catch(error){
            //error hai toh console krdo
            console.log("SENDOTP API ERROR............", error)
            //aur toast krdo ki otp send nai ho skta 
            toast.error("Could Not Send OTP")
        }
        //aur dispatch hook ki help se setLoading action krwao , state ko false update krne k lie
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

//function to call signup api to create new user
export function signUp(accountType, firstName, lastName,email, password, confirmPassword, otp, navigate ) {


    return async (dispatch) => {

    //toast show kro loading ka 
      const toastId = toast.loading("Loading...")
      //loading state ko true update kro
      dispatch(setLoading(true))

      try {
        //api call karo from api connector to post request to make new entry in db for new user
        const response = await apiConnector("POST", SIGNUP_API, {
          accountType,
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          otp,
        })
        
        //jo bhi response ayga api call ka console kro
        console.log("SIGNUP API RESPONSE............", response)
        
        //agar response success nahi ata toh error dedo 
        if (!response.data.success) {
          throw new Error(response.data.message)
        }

        //toast show kro sign up successfully ka
        toast.success("Signup Successful")

        //aur navigate kr jao login vale page par
        navigate("/login")
      }
       catch (error) {
        //agar koi error ata hai toh console kro
        console.log("SIGNUP API ERROR............", error)
        //toast show kro signup failed
        toast.error("Signup Failed")
        //aur fir se jao sign up vale page par
        navigate("/signup")
      }

      //loading state ko false krdo
      dispatch(setLoading(false))
      //toast htado loading ka
      toast.dismiss(toastId)
    }
  }


//function to call login api 
export function login(email , password , navigate){

    return async(dispatch)=>{
        //toast show kro loading ka
        const toastId = toast.loading("Loading...")

        //loading state ko true mark kro
        dispatch(setLoading(true))
        try{
            //request kro login api ko
            const response = await apiConnector("POST",LOGIN_API,{
                email, password
            })

            //console kro jo response aya hai request krke
            console.log("LOGIN API RESPONSE......",response)
           


            //agar response success nai aya toh message console kro
            if(!response.data.success){
                throw new Error(response.data.message)
            }

            //toast show kro login hogya hai
            toast.success("Login Successful")

            //token state m jo token mila hai api k response sy usko dal kr update kro
            dispatch(setToken(response.data.token))

            //user image naam k variable m jo response k andar agar image hai toh daldo vrna dicebear sy ek default image daldo
            const userImage = response.data?.User?.img  ? response.data.User.img : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.User.firstName} ${response.data.User.lastName}`

            //user state ko update krdo user ka data aur image dalkar
            dispatch(setUser({ ...response.data.User, image: userImage }))
          

            //local storage m token ko store krdo setItem func se , phle token ko json string ki form m convert krdo kyu ki local storage m sirf string store hoti hai
            localStorage.setItem("token", JSON.stringify(response.data.token))
            localStorage.setItem("user",JSON.stringify(response.data.User))

            //en sbke baad my profile vale page par chle jao
            navigate("/dashboard/my-profile")
        }
        catch(error){
            console.log("LOGIN API ERROR............", error)
            toast.error("Login Failed")
        }

             dispatch(setLoading(false))
            toast.dismiss(toastId)
    }
}


//function to logout 
export function logout(navigate) {
    return (dispatch) => {
        //token state ko null mark krdo
      dispatch(setToken(null))
      //user state ko bhi null mark krdo
      dispatch(setUser(null))
      //cart ko bhi reset krdo
      dispatch(resetCart())
      //local storage se token remove krdo
      localStorage.removeItem("token")
      //local storage se user ki value remove krdo
      localStorage.removeItem("user")
      //toast show kro logout ka
      toast.success("Logged Out")
      //aur home page par chle jao
      navigate("/")
    }
  }

export function getPasswordResetToken(email , setEmailSent){
  return async(dispatch) =>{
    
    dispatch(setLoading(true));
    try{
      const response =await apiConnector("POST",RESETPASSTOKEN_API ,{ email });

      console.log("Reset password token respone...",response);

      if(!response.data.success){
        throw new Error( response.data.message);
      }

      toast.success("Reset Email Sent")
      setEmailSent(true);
    }
    catch(err){
      console.log("reset password token error",err);
      toast.error("failed to send email for reseting password")
    }
    dispatch(setLoading(false));
  }
}

export function resetPassword (password , confirmPassword , token){
 
  return async(dispatch)=>{
    dispatch(setLoading(true))
    try{

      const response = await apiConnector("POST" , RESETPASSWORD_API , {
        password, confirmPassword , token
      })

      if(!response.data.success){
        throw new Error(response.data.message)
      }

      toast.success("Password reset successfully")

    }
    catch(err){
      console.log("error while reseting or updating password",err);
      toast.error("unable to reset password")
    }
    dispatch(setLoading(false))
  }
}