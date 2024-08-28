//import required modules
const express = require("express");
const router = express.Router()



//-----------------------------------------importing CONTROLLERS-------------------------------------
//course controllers
const { createCourse , getAllCourses , getCourseDetails , getFullCourseDetails , editCourse , getInstructorCourses ,deleteCourse} = require("../controllers/course")

//category controller
const { createCategory , showAllCategories , categoryPageDetails} = require("../controllers/category")

//section controller
const { createSection , updateSection , deleteSection} = require("../controllers/section")

//sub section controller
const { createSubSection , updateSubSection , deleteSubSection } = require("../controllers/subSection")

//rating controller
const {createRating , getAverageRating , getAllRating} = require("../controllers/ratingAndReview")

//course progress
const {updateCourseProgress} = require("../controllers/CourseProgress")
//-----------------------------------------------------------------------------------------------------------------





//--------------------------------------importing MIDDLEWARES------------------------------------------
const { auth , isAdmin , isInstructor , isStudent} = require("../middlewares/auth")
//-----------------------------------------------------------------------------------------------------------------





//--------------------------------ROUTES------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------


//COURSE ROUTES

//create new course
router.post("/createCourse",auth ,isInstructor ,createCourse);

//get all  course
router.get("/getAllCourses",getAllCourses);

//get details of specific course
router.post("/getCourseDetails",getCourseDetails);

// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)

// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)

// Get all Courses Under a Specific Instructor
router.post("/getInstructorCourses", auth, isInstructor, getInstructorCourses)

// Delete a Course
router.delete("/deleteCourse", deleteCourse)





//add section to course
router.post("/addSection",auth , isInstructor , createSection);

//update section
router.put("/updateSection",auth , isInstructor, updateSection);

//delete section
router.delete("/deleteSection",auth ,isInstructor,deleteSection);



//create subsection
router.post("/addSubsection",auth , isInstructor , createSubSection);

//update subsection
router.put("/updateSubsection",auth , isInstructor , updateSubSection);

//delete subsection
router.delete("/deleteSubSection",auth , isInstructor , deleteSubSection);




router.post("/updateCourseProgress",auth , isStudent , updateCourseProgress);


//-----------------------------------------------------------------------------------------------------------------





//-----------------------------------------------------------------------------------------------------------------
//CATEGORY ROUTES

//create category
router.post("/createCategory",auth , isAdmin , createCategory);

//show all categories
router.get("/showAllCategories",showAllCategories)

//get category page details
router.post("/getCategoryPageDetails", categoryPageDetails)
//-----------------------------------------------------------------------------------------------------------------





//-----------------------------------------------------------------------------------------------------------------
//RATING AND REVIEW ROUTES

//create rating
router.post("/createRating", auth, isStudent, createRating)

//get average rating
router.get("/getAverageRating", getAverageRating)

//get reviews
router.get("/getAllReviews", getAllRating)
//-----------------------------------------------------------------------------------------------------------------



module.exports = router



