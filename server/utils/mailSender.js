const nodemailer = require("nodemailer");

//this function used to send mail
const mailSender = async(email , title,body)=>{
    try{
         
        //creating transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })

        //using transporter to send mail
        let info = await transporter.sendMail({
            from: "ED-TECH",
            to: email,
            subject: title,
            html: body
        })

        console.log(info)
        return info;
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports = mailSender;