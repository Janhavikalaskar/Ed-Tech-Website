const Course = require("../models/course");
const SubSection = require("../models/subSection")
const Section = require("../models/section")
const User = require("../models/user");
const {ImageUploaderToCloudinary} = require("../utils/imageUploader");
const Category = require("../models/category")
const CourseProgress = require("../models/courseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")

require("dotenv").config();

//create course handler
exports.createCourse = async (req ,res) =>{
    try{
        //fetch info
        let {courseName , courseDescription , whatYouWillLearn , price , tag , category , status ,instructions} = req.body

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail || !category){
            return res.status(401).json({
                success:false,
            message:"all fields are required"})
            }

           	// Check if the user is an instructor
            const userId = req.user.id;
            const instructorDetails = await User.findById(userId , {accountType:"Instructor"});
            console.log("instructor details",instructorDetails)

            if(!instructorDetails){
                return res.status(404).json({
                    success:false,
                    message:"instructor not found"
                })
            }


            //what is this mean
            if (!status || status === undefined) {
                status = "Draft";
            }


            //check given category is valid or not
            const categoryDetails = await Category.findById(category);

            if(!categoryDetails){
                return res.status(404).json({
                    success:false,
                    message:"Category not found"
                })
            }

            //upload img to cloudinary
            const thumbnailImage = await ImageUploaderToCloudinary(thumbnail , process.env.FOLDER_NAME)

            //create entry for new course
            const newCourse = await Course.create({
                courseName,
                courseDescription,
                instructor:instructorDetails._id,
                whatYouWillLearn:whatYouWillLearn,
                price,
                tag:tag,
                thumbnail:thumbnailImage.secure_url,
                status:status,
                instructions:instructions,
                category: categoryDetails._id
            })

           		// Add the new course to the User Schema of the Instructor
            await User.findByIdAndUpdate(
                {_id:instructorDetails._id},
                //push or insert kar rhe hai course k array k andar newcourse ki id ko aur usko update kr rhe hai 
                {$push:{courses:newCourse._id}},
                {new:true}
            )

            		// Add the new course to the Categories
                    await Category.findByIdAndUpdate(
                        { _id: category },
                        {
                            $push: {
                                courses: newCourse._id,
                            },
                        },
                        { new: true }
                    );

            return res.status(200).json({
                success:true,
                message:"course created successfully",
                data:newCourse
            })
        }
    
    catch(err){
        console.log("error while creating course",err)
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

//get all courses handler
exports.getAllCourses = async (req,res)=>{
    try{
        const allCourses = await Course.find({} , {
            courseName :true , price:true , thumbnail:true , instructor:true , ratingAndReviews:true , studentsEnrolled:true
        }).populate("instructor").exec();

        return res.status(200).json({
            success:true,
            message:"data for all courses fetched successfully",
            data:allCourses
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"unable to fetch course data",
            
        })
    }
}


//get all details of course 
exports.getCourseDetails = async(req ,res)=>{

try{
    const {courseId} = req.body;
    
    console.log("course id ",courseId)

    if(!courseId){
        return res.status(400).json({
            success:false,
            message:"course id not found"
        })
    }

    const courseDetails =await Course.findById({_id: courseId })
                                                //populate karo instructor ko aur uske andar jo additional details usko bhi 
                                                .populate({ path:"instructor",populate:{path:"additionalDetails"} })
                                                //category bhi populate krdo
                                                .populate( "category")
                                                //rating and reviews ko bhi populate kro
                                                .populate("ratingAndReviews")
                                                //course content ko populate kro aur uske andar jo subsection hai usko bhi populate kro
                                                .populate( { path:"courseContent",populate:{path:"subSection", select: "-videoUrl",}})
                                                .exec()

    if(!courseDetails){
        return res.status(400).json({
            success:false,
            message:`couldn't find the course with this ${courseId} id `
        })
    }

    //change
    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
        success:true,
        message:"course details fetched succesfully",
        courseDetails,
        totalDuration
    })
}
catch(err){
    console.log(err)
    return res.status(500).json({
        success:false,
        message:"unable to fetch course details",
        
    })
}
}

// Edit Course Details
exports.editCourse = async (req, res) => {
    try {
      console.log("inside edit course")
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
      
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

  // Delete the Course
exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {


        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }

exports.getFullCourseDetails = async (req, res) => {
    try {
      
   
     const {courseId} = req.body
    
      
      const userId = req.user.id

   

      const courseDetails = await Course.findOne({
        _id:  courseId
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()

     
       
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }

  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  // Get a list of Course for a given Instructor
  exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }