const {instance} = require("../config/Razorpay");
const Course = require("../models/course");
const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/courseProgress");





//code for multiple item payment

//to initiate order or create order
exports.capturePayment = async (req,res)=>{

    //fetching courses id
    const {courses} = req.body;

    //fetching user id which was inserted in request while authenticating middleware
    const userId = req.user.id;

    //validation
    if(courses.length === 0){
        return res.json({success:false , message:"Please provide course id no course id present"});
    }

    let totalAmount=0;

    //calculate total amount for courses by traversing each course present in courses
    for(const course_id of courses){
        let course;
        try{
            //fetchind detail of each course
            course = await Course.findById(course_id);

            //if course not found
            if(!course){
                return res.status(404).json({success:false,message:"course not found for given course id"})
            }

            //check user already buy the course
            //converting userId from string to object id
            const uid = new mongoose.Types.ObjectId(userId)
            //course k andar student enrolled m user id present hai toh course phle se buy kar rkha hai
            if(course.studentsEnrolled.includes(uid)){
                return res.status(401).json({
                    success:false,
                    message:"course is already bought"
                })
            }

            totalAmount +=course.price;
        }
        catch(err){
            console.log(err);
            console.log("yaha fatra hai")
            return res.status(500).json({
                success:false,
                message:err.message
            })

        }
        
    }

    const options = {
        amount: totalAmount * 100,
        currency:"INR",
        receipt:Math.random(Date.now()).toString()
    }

    //creating orders for course using razorpay instance 
    try{
        const paymentResponse = await instance.orders.create(options);
        res.status(200).json({
            success:true,
            message:paymentResponse
        })

    }
    catch(err){
        console.log(err);
        console.log("yaha hai server error")
       return res.status(500).json({
            success:false,
            message:"could not initiate order"
        })

    }

}


//payment verification
//jo razor pay se signature aya hai aur jo signature hmare pass hai vo same hai toh successfull payment hai
exports.verifyPayment = async(req,res)=>{
    console.log("Inside payment verification controller")
    console.log(req.body)
    //fetching details from req 
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;


   //validation
    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return res.status(400).json({
            success:false,
            message:"payment failed"
        })
    }


    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

    if(expectedSignature === razorpay_signature){
        //enroll student
        await enrollStudents(courses , userId,res)
        //return res
        return res.status(200).json({
            success:true,
            message:"Payment verified"
        })
    }

    return res.status(500).json({
        success:false,
        message:"payment failed"
    })

    }

//function to enroll student in course
const enrollStudents = async(courses,userId , res)=>{
        if(!courses || !userId  ){
            return res.status(400).json({
                success:false,
                message:"please provide data for courses and user id"
            })
        }

        //har ek course par traverse karo
        for(const courseId of courses){
                try{
                        //aur Course par enrolledcourse ko update krdo userId se
            const enrolledCourse = await Course.findOneAndUpdate({_id:courseId},{$push:{studentsEnrolled:userId}},{new:true}).exec()
      

            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"course not found"
                })
            }

            const courseProgress = await CourseProgress.create({
                courseID:courseId,
                userId:userId,
                completedVideos:[],
            })
    
            //find student and add course to their list od enrolled courses
            const enrolledStudent = await User.findByIdAndUpdate({_id:userId},{$push:{courses: courseId ,courseProgress:courseProgress}},{new:true}).exec()
    
            if(!enrolledStudent){
                return res.status(500).json({
                    success:false,
                    message:"student not found"
                })
            }
    
            //send mail to user
            const emailResponse = await mailSender( enrolledStudent.email , `Successfully Enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName}`));
            console.log("email sent successfully",emailResponse);

                }

                catch(err){
                    console.log(err);
                    return res.status(500).json({
                        success:false,
                        message:"unable to enroll students"
                    })
                }
    }
        
}


//payment successfull email to user
exports.sendPaymentSuccessEmail = async(req,res)=>{

   

    const {orderId,paymentId,amount}=req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({success:false,message:"Please provide all fields"});
    }

     //student ko dhundo
     const enrolledStudents = await User.findById(userId);

    try{
        //search student
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudents.email,
            `Payment Recieved`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`,amount/100,orderId,paymentId)
        )
    }
    catch(err){
        console.log("error while sending payment success email",err);
        return res.status(500).json({success:false,message:"could not send email"});
    }
}















































// //below code is only for signle item  payment 

// //capture the payment and initiate the razor pay order -> course ka order create kro
// exports.capturePayment = async(req ,res)=>{
//     //get course id and user id
//         const {course_id} = req.body;
//         const userId = req.user.id;
//     //validations
//     //valid course id or not
//         if(!course_id){
//             return res.json({
//                 success:false,
//                 message:"please provide valid course id"
//             })
//         }
//     //valid course detail or not
//         let course;
//         try{
//             course = await Course.findById(course_id);
//             if(!course){
//                 return res.json({
//                     success:false,
//                     message:"could not find the course wrong course id"
//                 })
//             }

//     //does user already paid for this course
//             //converting userid which is string into object id , to check in teh student enrolled in course
//             const uID = new mongoose.Types.ObjectId(userId)
//             if(course.studentsEnrolled.includes(uID)){
//                 return res.status(200).json({
//                     success:false,
//                     message:"student is already enrolled"
//                 })
//             }
//         }
//         catch(err){
//             console.log(err);
//             return res.status(500).json({
//                 success:false,
//                 message:err.message
//             })
//         }

//     //create order now for courses
//     const  amount = course.price;
//     const currency = "INR";
//     const options = {
//         amount: amount*100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId : course_id,
//             userId,
//         }
//     }
//     try{
//         //initiate the payment using razorpay -> creating order for course , kisi course k lie order create krengy
//         const paymentResponse = await instance.orders.create(options);
//             console.log(paymentResponse);

//             return res.status(200).json({
//                 success:true,
//                 courseName:course.courseName,
//                 courseDescription:course.courseDescription,
//                 thumbnail:course.thumbnail,
//                 orderId: paymentResponse.id,
//                 currency:paymentResponse.currency,
//                 amount:paymentResponse.amount
//             })
//     }
//     catch(err){
//         console.log(err);
//         return res.json({
//             success:false,
//             message:"could not initiate order"
//         })
//     }

  
// };




// //after order creation -> ,when payment is done by user,the user bank transfer money to razorpay website wallet
// // razorpay -> activate karega webhook ko ,aur fir webhook ki request aygi signature verification k lie jo neeche hogi






// //this is done after payment is done by user and razor pay will send a request in which  web-hook is present with secret and we will match it with secret present in our server
// //payment verification of razorpay and server, or payment authorization
// exports.verifySignature = async(req ,res)=>{
//     const webhooksecret = "12345678";

//     //razorpay will pass signature value in header , in this x-razorpay-signature key
//     //razorpay already signature ko encrypt karke dega using Hmac-sha256 algo 
//     const signature = req.headers["x-razorpay-signature"];

//     //eslie hum bhi apne webhooksecret ko same algo se hash krdengy jis se hum use match kar pae
//     //hashing the webhooksecret using Hmac  function present in crypto library 
//     //here we have to pass the algo -> sha256 by which we have to hash it,and the value to be hashed
//    const shasum = crypto.createHmac( "sha256" , webhooksecret);
//    //converting shasum into string format
//    shasum.update(JSON.stringify(req.body));
//    //jab bhi koi hashing algo run krty hai kisi text par , toh jo output ata hai usko khty hai digest which is generally in hexa decimal format
//    //creating digest
//    const digest = shasum.digest("hex");

//    //checking for signature and digest verification by comparing
//    if(signature === digest){
//     console.log("payment is authorized")

// //jab razorpay request karega signature verification k lie , tab request body m order ki info bhi send karega, jisme notes present hai order vale,
// //notes k andar humne course id or user id dali thi further action krwane k lie after signature verification
// //fetch coursId and userId from request body
// const {courseId , userId} = req.body.payload.payment.entity.notes;

//     try{
//     //find course and enroll the student into it
//     const enrolledCourse = await Course.findOneAndUpdate( {_id:courseId},
//                                                                 {$push:{studentsEnrolled:userId}},
//                                                                 {new:true}
//                                                         );
//     if(!enrolledCourse){
//         return res.status(500).json({
//             success:false,
//             message:"course not found"
//         })
//     }
//     console.log(enrolledCourse)

//     //find student and update course into list of enrolled courses
//     const enrolledStudent = await User.findOneAndUpdate(
//                                                         {_id:userId},
//                                                         {$push:{courses:courseId}},
//                                                          {new:true}
//                                                          );

//     //send mail to user for course enrollement successfully with designed template
//     const emailResponse = await mailSender(enrolledStudent.email , 
//                                             "Congratulation ,your course purchase is done successfully ",
//                                             courseEnrollementEmail( enrolledCourse.courseName,enrolledStudent.name) );
    
//     console.log(emailResponse);
//    return res.status(200).json({
//     success:true,
//     message: "signature verified and course added"
//    });
// }
// catch(err){
//     console.log(err);
//     return res.status(500).json({
//         success:false,
//         message:err.message
//     })
// }
//    }
//    else{
//     return res.status(400).json({
//         success:false,
//         message:"invalid request"
//     })
//    }
// };









