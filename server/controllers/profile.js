const Profile = require("../models/profile");
const {ImageUploaderToCloudinary} = require("../utils/imageUploader")
const User = require("../models/user")
const { convertSecondsToDuration } = require("../utils/convertSecondsToDuration");
const CourseProgress = require("../models/courseProgress");
const Course = require("../models/course")
const Review = require("../models/ratingAndReview");

//update profile
exports.updateProfile = async (req ,res)=>{
    try{
       
        //get data
        const {dateOfBirth="", about="",contactNumber ,gender} = req.body
        //get user id from req which is present in payload while decoding the token from cookies in authentication middleware
        const id = req.user.id;
     
 
        //find profile
        const userDetails = await User.findById(id);
        const profile = await Profile.findById(userDetails.additionalDetails);


       
        
        //updating the profile fields
            profile.dateOfBirth = dateOfBirth;
            profile.about = about;
            profile.gender = gender;
            profile.contactNumber = contactNumber;
        //update profile
        (await profile.save())
        //return response
        return res.status(200).json({
            success:true,
            message:"profile updated successfully",
            profile,
            userDetails
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"unable to update profile"
        })
    }
}


//delete profile
exports.deleteAccount = async (req , res)=>{
    try{
        //get id of user
        const ID = req.user.id;
 
        //validation
        const user = await User.findById({_id:ID});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
          //delete student review
          if(req.user.accountType === "student"){
            await Review.findByIdAndDelete({user:ID})
          }
        //delete profile 
        await Profile.findByIdAndDelete({_id:user.additionalDetails})
        //delete user
        await User.findByIdAndDelete({_id:ID})
      
      

        //return response
        return res.status(200).json({
            success:true,
            message:"account deleted successfully"
        })
    }
    catch(err){
      console.log(err)
        return res.status(500).json({
            success:false,
            message:"unable to delete profile"
        })
    }
}

//get all details of user
exports.getAllUserDetails = async(req,res)=>{
   try{
    const id = req.user.id
    console.log("running")
    
    const userDetails = await User.findById(id).populate("additionalDetails").exec();
    return res.status(200).json({
        success:true,
        message:"user data fetched successfully",
        userDetails
    })
   }
   catch(err){
    return res.status(500).json({
        message:err.message
    })
   }
}


//to update display picture
exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      console.log(displayPicture)
      const userId = req.user.id;
      const image = await ImageUploaderToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
   
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { img: image.secure_url },
        { new: true }
      ).populate("additionalDetails").exec()
    
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

//get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
      .populate({
        path: "courses",
        populate: {
        path: "courseContent",
        populate: {
          path: "subSection",
        },
        },
      })
        .exec()
        


  
      let  userDetail = userDetails.toObject()

        var SubsectionLength = 0;

        for (var i = 0; i < userDetail.courses.length; i++) {

        let totalDurationInSeconds = 0
        SubsectionLength = 0


        for (var j = 0; j < userDetail.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetail.courses[i].courseContent[
          j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetail.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
          )
          SubsectionLength +=
          userDetail.courses[i].courseContent[j].subSection.length
        }


        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetail.courses[i]._id,
          userId: userId,
        })

        courseProgressCount = courseProgressCount?.completedVideos.length

        if (SubsectionLength === 0) {
          userDetail.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetail.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
        }
        }
     



      if (!userDetail) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetail}`,
        })
      }
      console.log(userDetail)
      return res.status(200).json({
        success: true,
        data: userDetail.courses,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};



exports.instructorDashboard = async(req,res)=>{
  try{

    const courseDetails = await Course.find({instructor : req.user.id});

    if(!courseDetails){
      return res.status(404).json({
        message:"instructor not found"
      })
    }

    

    const courseData = courseDetails.map( (course)=>{
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      //create a new object with additional fields
      const courseDataWithStats = {
        _id:course._id,
        courseName:course.Name,
        courseDescription : course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated
      }
      return courseDataWithStats
    })

 
   return res.status(200).json({
      courses:courseData
    })
  }
  catch(err){
    console.log(err)
    return res.status(500).json({
      success:false,
      message:"internal server error"
    })
  }
}