import {studentEndpoints} from "../api";
import { toast } from "react-hot-toast";
import {apiConnector} from "../apiConnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import {resetCart} from "../../slices/cartSlice"


const {COURSE_PAYMENT_API, COURSE_VERIFY_API , SEND_PAYMENT_SUCCESS_EMAIL_API}= studentEndpoints;







//function to load external script on runtime
function loadScript(src) {
    return new Promise((resolve) => {
        // Create a new script element
        const script = document.createElement("script");
        // Set the 'src' attribute of the script to the provided URL
        script.src = src;

        // Event handler for when the script successfully loads
        script.onload = () => {
            // Resolve the Promise with 'true' to indicate successful loading
            resolve(true);
        }

        // Event handler for when there's an error loading the script
        script.onerror = () => {
            // Resolve the Promise with 'false' to indicate failure
            resolve(false);
        }

        // Append the script element to the <body> of the document
        document.body.appendChild(script);
    });
}





//order initiate handler
export async function buyCourse(token , courses , userDetails,navigate,dispatch){
    const toastId = toast.loading("Loading...");
    try{
        //load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res){
            toast.error("Razorpay sdk failed to load");
            return;
        }

        //initiate the order,call course payment api to create order for course
        const orderResponse = await apiConnector("POST",COURSE_PAYMENT_API,
        {courses},
         {
            Authorization:`Bearer ${token}`
         })

         if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
         }

         console.log("payment order response......",orderResponse)

         //opening razorpay sdk
        //options
         const options={
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_id: orderResponse.data.message.id,
            name:"Code-Up",
            description:"Thank You for Purchasing the course",
            image:rzpLogo,
            prefill:{
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler:function (response){
                
                //send successfull mail
                sendPaymentSuccessEmail(response,orderResponse.data.message.amount,token);
                //verify payment
                verifyPayment({...response,courses},token,navigate,dispatch);
            }
         }

         //payment ka dialouge box window bnao
         const paymentObject = new window.Razorpay(options);
         //usko open kro
         paymentObject.open();
         paymentObject.on("payment.failed",function(response){
            toast.error("oops,payment failed");
            console.log(response.error)
         })

    }
    catch(err){
        console.log("payment api error",err)
        toast.error("could not make payment");
    }
    toast.dismiss(toastId)
}

//payment success email handler
async function sendPaymentSuccessEmail(response , amount , token){
   
    try{
        await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,{
            orderId:response.razorpay_order_id,
            paymentId:response.razorpay_payment_id,
            amount
        },{
            Authorization:`Bearer ${token}`
        })
    }
    catch(err){
        console.log("Payment success email error",err)
    }
}

//verify payment 
async function verifyPayment(bodyData,token , navigate,dispatch){
    const toastId = toast.loading("verifying payment");
    dispatch(setPaymentLoading(true));
    try{
        const response = await apiConnector('POST',COURSE_VERIFY_API,bodyData,{
            Authorization:`Bearer ${token}`
        })

        console.log("verify payment response from backend " , response)

        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("payment Successful")
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }
    catch(err){
        console.log("paymnet verification err",err)
        toast.error("unable to verify payment")
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false))
}