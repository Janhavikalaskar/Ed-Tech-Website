const Section = require("../models/section");
const Course = require("../models/course");


 exports.createSection = async(req ,res)=>{
    try{
        //fetch data
        const {sectionName , courseId} = req.body;
        //validation
        if(!sectionName || !courseId){  return res.status(400).json({
            success:"false",
            message:"missing properties"
        })}
      
        //create section
        const newSection = await Section.create({sectionName});

        //update in course schema also 
        //course k schema m jo course content hai usme newSection ki id dalo aur, subsection ko populate kro courseContent k andar
        const updatedCourse = await Course.findByIdAndUpdate(
                                            courseId, {
                                                $push:{courseContent:newSection._id}
                                            },
                                            {new:true})
                                   .populate( {path: "courseContent", populate: {path: "subSection"}} ).exec()
    

//return response
        return res.status(200).json(
            {
            success:"true",
            message:"section created successfully",
            updatedCourse
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"unable to create section",
            error:err
        })
    }
}

//course update handler
exports.updateSection = async(req ,res)=>{
    try{
        const {sectionName , sectionId ,courseId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:"false",
                message:"missing properties"
            })
        }

        //update section
        const section = await Section.findByIdAndUpdate(sectionId , 
                                                                    {sectionName:sectionName},
                                                                    {new:true}
                                                                     );

        const data = await Course.findById(courseId).populate( {path: "courseContent", populate: {path: "subSection"}} ).exec()

      


            return res.status(200).json({
                success:true,
                message:"section Updated Successfully",
                data
            })
        }
    catch(err){
        console.log("error while updating subsection",err)
        return res.status(500).json({
            success:false,
            message:"unable to create section",
            error:err
        })
    }
}


exports.deleteSection = async(req,res) =>{
    try{

        //we are assuming that we are sending id in parameters
        const {sectionId , courseId} = req.body;
        console.log("section id",sectionId)
        console.log("course id",courseId)


       if (!sectionId){
        return res.status(400).json({
            success:"false",
            message:"missing properties"
        })
       }

       const newSection = await Section.findByIdAndDelete( sectionId ,{new:true});

       //to delete section from course also
       const updateCourse = await Course.findByIdAndUpdate( courseId , {$pull:{courseContent:sectionId}} , {new:true});

       return res.status(200).json({
        success:true,
        message:"deleted successfully",
        updateCourse
        
       })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"unable to delete section",
            error:err
        })
    }
}