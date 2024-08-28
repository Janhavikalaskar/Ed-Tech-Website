const ratingAndReview = require("../models/ratingAndReview");
const Course = require("../models/course");
const { default: mongoose } = require("mongoose");

//create rating
exports.createRating = async(req ,res)=>{
     try{

        //get user id
        const userId = req.user.id;
        //fetch rating from req
        const {rating , review , courseId} = req.body

        //check if user is enrolled or not
        const courseDetails = await Course.findOne({ _id:courseId, studentsEnrolled: {$elemMatch:{$eq:userId} } })
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"student is not enrolled in this course"
            })
        }
        //check if user already reviewed the course
        //agaar rating and review k andar user id and course id phle se hai toh user n phle hi review krdia hai
        const alreadyReviewed = await ratingAndReview.findOne( { user:userId , course:courseId});

        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"student already reviewed the course"
            })
        }

        //create rating and review
        const ratingReview = await ratingAndReview.create({
            rating , 
            review,
            course:courseId,
            user:userId
        });

        //update course 
        const updatedCourse = await Course.findByIdAndUpdate({_id:courseId}, { $push:{ratingAndReviews:ratingReview.id} } ,{new:true})
        console.log(updatedCourse)

        return res.status(200).json({
            success:true,
            message:"rating and review created successfully",
            ratingReview
        })
     }
     catch(err){
        console.log(err);
        return res.status().json({
            success:false,
            message:"unable to create rating and review"
        })
     }
}


//average rating
exports.getAverageRating = async(req , res)=>{
    try{

        //get course id
        const courseId = req.body.courseId;
        //calculate average rating
        const result = await ratingAndReview.aggregate([
            {  $match:{course:new mongoose.Types.ObjectId(courseId)}   },
            {   $group:{_id:null,averageRating:{$avg:"$rating"}}       }
        ])
        //return rating
        if(result.length>0){
            return res.status(200).json({
                success:false,
                averageRating:result[0].averageRating
            })
        }
        //if no rating review
        return res.status(200).json({
            success:true,
            message:"average rating is 0, no rating available"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"unable to get average rating"
        })
    }
}

//get all rating
exports.getAllRating = async(req ,res)=>{
    try{
        const allreviews = await ratingAndReview.find({}).sort({rating:"desc"}).populate({path:"user",select:"firstName lastName email image"}).populate({path:"course",select:"courseName"}).exec()

        return res.status(200).json({
            success:true,
            allreviews
        })
    }
    catch(err){
        console.log(err)

        return res.status(500).json({
            success:false,
            message:"unable to get all average rating"
        })
    }
}