const mongoose = require("mongoose");
const mailsender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate")
const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 60*5, // The document will be automatically deleted after 5 minutes of its creation time
    }
})

//function to send mail
async function sendVerificationEmail(email , otp){
    try{
        const mailResponse = await mailsender(email , "Verification email", emailTemplate(otp));
        console.log("email sent successfully",mailResponse.response)
    }
    catch(err){
        console.log("error occured while sending mail",err)
    }
}

//pre middleware
otpSchema.pre("save",async function (next){
    //only send email when new document is created
    if( this.isNew){ 
    await sendVerificationEmail(this.email , this.otp);
    }
    next();
})

module.exports = mongoose.model("OTP",otpSchema)

