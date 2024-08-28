const SubSection = require("../models/subSection");
const CourseProgress = require("../models/courseProgress")

exports.updateCourseProgress = async(req,res)=>{
    const {courseId , subSectionId} =req.body;
    const userId = req.user.id;

    try{

        //check if subsection valid
        const subsection = await SubSection .findById(subSectionId)

        if(!subsection){
            return res.status(404).json({error:"INvalid subsection id"})
        }

        //check for old entry
        let courseProgress = await CourseProgress.findOne({
            courseID:courseId,
            userId:userId
        });

        if(!courseProgress){
            return res.status(404).json({
               success:false,
               message:"course Progress does not exist"
            })
        }
        else{
            //check is video already completed
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    error:"subsection is already completed"
                })
            }

            //push subsection id into completed video
            courseProgress.completedVideos.push(subSectionId)

        }
        await courseProgress.save()

        return res.status(200).json({
            success:true,
            message:'lecture marked completed'
        })
        

    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            error:"internal server error"
        })
    }
}