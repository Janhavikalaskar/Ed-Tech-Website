const user = require("..//models/user");
const OTP = require("../models/otp");
const otpGenerator = require("otp-generator");
const Profile = require("../models/profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const mailSender = require("../utils/mailSender");
const {passwordUpdated} = require("../mail/templates/passwordUpdate");


//to send otp for sign up , handler -> basically to generate otp not to send 
 exports.sendOTP = async(req,res)=>{
    try{

    //fetch email from request body
    const {email} = req.body;

      // Check for valid email format
      if (!email.includes('@')) {
        return res.status(403).json({
            success: false,
            message: "Invalid email format"
        });
    }

    //check user exist or not
    const isUserPresent = await user.findOne({email});

    //if user exist
    if(isUserPresent){
        return res.status(401).json({
            success:false,
            message:"user already registered"
        })
    }

    //if user not exist
    //generate otp
    var otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    })
    console.log("otp generated",otp);

    //check unique otp or not
    const result = await OTP.findOne({otp:otp});
    //if result true so otp is not unique 
    while(result){
        otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
        })
    }

    const otpPayload = {email , otp};

    //create entry in db for otp
    const  otpbody = await OTP.create(otpPayload)
    console.log("otp body", otpbody);

    res.status(200).json({
        success:true,
        message:"otp sent successfully",
        otp
    })
    }
    catch(err){
        console.log("error while generating otp",err);
        return res.status(500).json({
            success:false,
            message:"unable to generate otp"
        })
    }
 }




//to sign up for new user
exports.signUp = async (req ,res)=>{
    try{
  
        //fetch data from request body
        const { firstName , lastName , email , password , confirmPassword , accountType
        , contactNumber , otp} = req.body;

        
        //validation
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            
            return res.status(403).json({
                success:false,
                message:"all field are required"
            })
        }
       

        

        //password and confirm password ko match check karo match kar rhe hai ya nai
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"password and confirm password value does not match , please try again"
            });
        }
        
        //if password and confirm password matched
        //check user already exist or not
        const exist = await user.findOne({email});
        //if user is exist already return false
        if(exist){
            return res.status(400).json({
                success:false,
                message:"user already registered with this email",
            })
        }

        //find most recent otp for the user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
       

        //validate otp
        //if recent otp length is zero
        if(recentOtp.length == 0 ){
            //otp not found
            return res.status(400).json({
                success:false,
                message:"otp not found",
            })
        }
        //if sended otp is not matched with recent data base otp
        else if(otp !== recentOtp[0].otp){
            //invalid otp
            return res.status(400).json({
                success:false,
                message:"invalid otp",
            })
        }
        //hash password using bcrypt 
        const hashedPassword = await bcrypt.hash(password, 10);

        
        //agar  instructor hai toh approved ko false krdo aur agar instructor nahi hai toh usko true krdo
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

      // Create the Additional Profile For User
        const profileDetails = (await Profile.create({gender:null , dateOfBirth :null , about:null , contactNumber:null}))

        //create new user
        const newUser = await user.create({
            firstName , lastName , email , contactNumber , password:hashedPassword , accountType, approved:approved,
            additionalDetails:profileDetails._id , img:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        })

        console.log("type of email",typeof(email));
    return res.status(200).json({
            success:true,
            message:"sign up successfully",
            newUser
        })

    }
    catch(err){
        console.log("error while signing up",err)
       return  res.status(500).json({
            success:false,
            message:"sorry unable to sign up now",
            error:err
        })
    }
        
}


//to login
exports.login = async (req,res) => { 
try{
//fetch email and password
const {email , password } = req.body;
//validation
if(!email || !password){
    return res.status(400).json({
        success:false,
        message:"please fill the data "
    })
}

//check user exist or not
const User = await user.findOne({email}).populate("additionalDetails").exec();

if(!User){
    return res.status(401).json({
        success:false,
        message:"user not registered ,sign up first",
    })
}

//if user exist 
//matching hash password

//if password matched
if(await bcrypt.compare( password , User.password)){
    const payload = {
        email : User.email,
        id: User.id,
        accountType:User.accountType
    }
    //genrating jwt token
 const token = jwt.sign(payload , process.env.JWT_secret,{
        expiresIn:"24h" });

		// Save token to user document in database
        User.token = token;
        User.password = undefined;

//generate cookie for token
res.cookie("token",token ,
 { expiresIn:new Date(Date.now()+3*24*60*60*1000) , httpOnly:true}).status(200).json({
    success:true,
    token,
    User,
    message:"logged in successfully"
})
}
//if password not matched
else{
    return res.status(401).json({
        success:false,
        message:"password is incorrect"
    })
}

}
catch(err){
     console.log("error while login ",err)
     return res.status(500).json({
        success:false,
        message:"unable to login ",
        error:err
     })
}
}


//to change password 
exports.changePassword = async(req,res)=>{
    try{
        
        //get user data from req.user which is entered while authentication, by decoding token 
        const userDetails = await user.findById(req.user.id);

          //get old password , new password , confirm new password
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
        if(!isPasswordMatch){
            return res.status(401).json({
                success:"false",
                message:"entered old password is incorrect"
            })
        }

        //match new password and confirm new password
        if(newPassword !== confirmNewPassword){
            // If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
        }

            //update password
            const encryptedPassword = await bcrypt.hash(newPassword , 10);
            const updatedUserDetails = await user.findByIdAndUpdate(
                req.user.id,
                {password:encryptedPassword},
                {new:true}
            );

            //send notification email that password is updated
            try{
                const emailResponse = await mailSender( updatedUserDetails.email ,
                    `Password updated successfully for ${updatedUserDetails.firstName}${updatedUserDetails.lastName}`,
                    (passwordUpdated(updatedUserDetails.email,updatedUserDetails.firstName+updatedUserDetails.lastName)));
                    
                    console.log(`email sent successfully for ${emailResponse.response}`)
            }
            catch(error){
// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
console.error("Error occurred while sending email:", error);
return res.status(500).json({
    success: false,
    message: "Error occurred while sending email",
    error: error.message,
  })
    }
    // Return success response
		return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
}
catch(error){
// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
console.error("Error occurred while updating password:", error);
return res.status(500).json({
    success: false,
    message: "Error occurred while updating password",
    error: error.message,
});
}
}



     
   

    
