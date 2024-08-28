import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI';
import {HiOutlineCurrencyRupee} from 'react-icons/hi'
import RequirementField from './RequirementField';
import {setStep} from '../../../../../slices/courseSlice'
import IconBtn from "../../../../common/IconBtn"
import { setCourse } from '../../../../../slices/courseSlice';
import {toast} from "react-hot-toast"

import {COURSE_STATUS} from "../../../../../utils/constants"
import ChipInput from './ChipInput';
import Upload from './Upload'

const CourseInformationForm = () => {

  const {token} = useSelector((state)=>state.auth)
  const {course , editCourse} = useSelector ( (state)=> state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories,setCourseCategories] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState:{errors}
  }=useForm();


  const dispatch = useDispatch();

  //phle render par categories fetch krlo
  useEffect( ()=>{
    const getCategories = async()=>{
      setLoading(true);
      const categories = await fetchCourseCategories();
      if(categories.length>0){
        setCourseCategories(categories);
      }
      setLoading(false);
    }

    //agar editCourse true hua hai toh form ki value update krdo , jo course k andar properties hai us se
    if(editCourse){
      setValue("courseTitle",course.courseName)
      setValue("courseShortDesc",course.courseDescription)
      setValue("coursePrice",course.price)
      setValue("courseTags",course.tag)
      setValue("courseBenefits",course.whatYouWillLearn)
      setValue("courseCategory",course.category)
      setValue("courseRequirements",course.instructions)
      setValue("courseImage",course.thumbnail)
    }
    getCategories()
  },[])

  //kya form update hua hai
  const isFormUpdated= ()=>{

    //sari value form ki fetch kro
    const currentValues = getValues();


    //agar course ki value or form ki value equal nai hai toh update hua hai
    if(currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
       currentValues.courseTags.toString()!== course.tag.toString() ||
      currentValues.courseCategory._id!== course.category._id ||
      currentValues.courseImage !== course.thumbnail ||
      currentValues.courseRequirements.toString() !== course.instructions.toString() ){
      return true
    }
    else{
      return false
    }
  }

  const onSubmit = async(data)=>{
  

    //agar course edit hua hai , agar edit course true hai toh 
 if(editCourse){

  //aur form update hua hai
  if(isFormUpdated()){

    
      const currentValues = getValues();
      const formData = new FormData()
   
//new form m value update krdo
      formData.append("courseId",course._id);

      if(currentValues.courseTitle!== course.courseName){
        formData.append("courseName",data.courseTitle)
      }

      if(currentValues.courseShortDesc !== course.courseDescription){
        formData.append("courseDescription",data.courseShortDesc)

      }
      if(currentValues.coursePrice !== course.price){
        formData.append("price",data.coursePrice)

      }
      if (currentValues.courseTags.toString() !== course.tag.toString()) {
        formData.append("tag", JSON.stringify(data.courseTags))
      }
      
      if(currentValues.courseCategory._id!== course.category._id ){
        formData.append("category",data.courseCategory)

      }
      if (currentValues.courseImage !== course.thumbnail) {
        formData.append("thumbnailImage", data.courseImage)
      }

     if( currentValues.courseRequirements.toString() !== course.instructions.toString() ){
      formData.append("instructions", JSON.stringify(data.courseRequirements))

     }

     setLoading(true);
     //updated value ko pass krdo backend p
     const result = await editCourseDetails(formData,token);
     setLoading(false);
     if(result){
      setStep(2);
      dispatch(setCourse(result));
     }
  }
  
  else{
    toast.error("NO CHANGES MADE SO FAR ")
  }
  return;

}





//CREATE A NEW COURSE

//ek new formdata create kia request m bhjne k liye 
const formData  = new FormData();

//formdata m save kar rhe hai values ko according to backend
formData.append("courseName", data.courseTitle)
formData.append("courseDescription", data.courseShortDesc)
formData.append("price", data.coursePrice)
formData.append("tag", JSON.stringify(data.courseTags))
formData.append("whatYouWillLearn", data.courseBenefits)
formData.append("category", data.courseCategory)
formData.append("status", COURSE_STATUS.DRAFT)
formData.append("instructions", JSON.stringify(data.courseRequirements))
formData.append("thumbnailImage", data.courseImage)

console.log("new form data",formData)

setLoading(true);
// creating course
const result = await addCourseDetails(formData,token);
if(result){
  dispatch(setStep(2));
  dispatch(setCourse(result))
}
setLoading(false)

  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}
  className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">



    {/* course title */}
    <div className="flex flex-col space-y-2">
          <label htmlFor='courseTitle' className="text-sm text-richblack-5">Course Title <sup className="text-pink-200">*</sup></label>
          <input id='courseTitle' placeholder='Enter Course Title' {...register("courseTitle",{required:true})}
            className="form-style w-full"
          />
          {
            errors.courseTitle &&(
              <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is required</span>
            )
          }
    </div>


    {/* course short description */}
    <div className="flex flex-col space-y-2">
      <label htmlFor='courseShortDesc' className="text-sm text-richblack-5" >Course Short Description <sup className="text-pink-200">*</sup></label>
      <textarea id="courseShortDesc" placeholder='Enter Description' {...register( "courseShortDesc",{required:true})} className="form-style resize-x-none min-h-[130px] w-full" />
      {
        errors.courseShortDesc &&(
          <span className="ml-2 text-xs tracking-wide text-pink-200">Course Description is required </span>
        )
      }
    </div>


    {/* course price */}
    <div className="flex flex-col space-y-2">
      <label htmlFor='coursePrice' className="text-sm text-richblack-5" >Course Price <sup className="text-pink-200">*</sup></label>
      <input id='coursePrice' placeholder='Enter Course Price' {...register("coursePrice",{required:true , valueAsNumber:true}) } className="form-style w-full !pl-12"/>
      <HiOutlineCurrencyRupee className=" top-1/2 inline-block -translate-y-[45px] translate-x-[6px] text-2xl text-white "/>
      {
        errors.coursePrice &&(
          <span className="ml-2 text-xs tracking-wide text-pink-200">Course Price is required</span>
        )
      }
    </div>


    {/* categories drop down  */}
    <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor='courseCategory'> Course Categories <sup className="text-pink-200">*</sup> </label>
          <select id='courseCategory' defaultValue="" {...register("courseCategory",{required:true})} className="form-style w-full">
                  <option value="" disabled >Choose a Category</option>
                  {
                    !loading && courseCategories.map( (category,index)=>{
                      return(
                        <option key={index} value={category?._id}>
                          {category?.name}
                        </option>
                      )
                    })
                  }
           </select>
           {
            errors.courseCategories &&(
              <span className="ml-2 text-xs tracking-wide text-pink-200">Course Categories is required</span>
            )
           }
    </div>


    {/* tags input */}
    <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />


    {/* thumbnail uploader */}
    <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}/>


    {/* benefits of the course */}
    <div className="flex flex-col space-y-2">
      <label htmlFor='courseBenefits' className="text-sm text-richblack-5" >Benefits of the course <sup className="text-pink-200">*</sup></label>
      <textarea id='courseBenefits' placeholder='Enter Benefits of the course' {...register('courseBenefits',{required:true})} className="form-style resize-x-none min-h-[130px] w-full"/>
      {
        errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">Course Benefits are required</span>
        )
      }
    </div>


    {/* requirement fields */}
    <RequirementField name="courseRequirements" label="Requirement / Instructions" register={register} errors={errors} setValue={setValue} getValues={getValues}/>


      {/* next btn */}
      <div className="flex justify-end gap-x-2">

            {
              editCourse && (
                <button onClick={()=>dispatch(setStep(2))} className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900` }>Continue Without Save</button>                
              )
            }

            <IconBtn text={!editCourse ? "Next":"Save Changes"} />

      </div>

    </form>
  )
}

export default CourseInformationForm