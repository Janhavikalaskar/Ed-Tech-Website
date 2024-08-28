import React from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn'
import { useState } from 'react'
import {BiAddToQueue} from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux'
import {BiRightArrow} from "react-icons/bi"
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice'
import { toast } from 'react-hot-toast'
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI'
import NestedView from './NestedView'


const CourseBuilderForm = () => {


  const {register , handleSubmit,setValue , formState:{errors}} = useForm();

  
  const dispatch = useDispatch()
  // here editSectionName is section id
  const [editSectionName , setEditSectionName] = useState(null)
  const {course} = useSelector( (state)=>state.course)

  const [loading ,setLoading] = useState(false);
  const {token}= useSelector( (state)=>state.auth)


    // handle form submission
  const onSubmit = async(data)=>{
    console.log("editing section name")


    setLoading(true);

    //if editSectionName is true
    if(editSectionName){
      //we are  editing section name
     let result = await updateSection({
        sectionName:data.sectionName , sectionId:editSectionName,courseId:course._id},token );
            //update values
        if(result){
         dispatch(setCourse(result));
          setEditSectionName(null);
        setValue("sectionName","")
  }
    }

    //creating new section
    else{
     let result = await createSection( {sectionName : data.sectionName , courseId:course._id},token );
         //update values
  if(result){
    console.log(course)
    dispatch(setCourse(result));
    setEditSectionName(null);
    setValue("sectionName","")
  }
    }

  //loading false
  setLoading(false)

  }



  const cancelEdit = ()=>{
    setEditSectionName(null);
    setValue("sectionName","");
  }

    
  const goBack = () => {
    console.log("go back")
      dispatch(setStep(1))
      dispatch(setEditCourse(true))
    }


  const goToNext = ()=>{
    if(course?.courseContent.length === 0){
      toast.error("Please add atleast one section")
      return;
    }
    if(course.courseContent.some( (section)=>section.subSection.length === 0)){
      toast.error("Please add atleast one lecture in each Section")
      return;
    }
    //if everthing good
    dispatch(setStep(3))
  }



 

  
  const handleChangeEditSectionName = (sectionName ,sectionId)=>{

    if(editSectionName === sectionId){
      cancelEdit();
      return
    }

    setEditSectionName(sectionId);
    setValue("sectioName",sectionName);
  }


  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">

      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">



        <div className="flex flex-col space-y-2">
          <label htmlFor='sectionName' className="text-sm text-richblack-5">Section name <sup className="text-pink-200">*</sup></label>
          <input id='sectionName' placeholder='Add section name' {...register("sectionName",{required:true})}  className="form-style w-full"/>
          {
            errors.sectionName && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">Section Name is required</span>
            )
          }
        </div>


          <div className="flex items-end gap-x-4">


        <IconBtn type="Submit" text={ !editSectionName ? "Create Section" : "Edit Section Name"} outline={true} customClasses={"text-white"} >  
        <BiAddToQueue  size={20} className="text-yellow-50"/>
        </IconBtn>

         
        {editSectionName && (<button type='Button' onClick={cancelEdit} className="text-sm text-richblack-300 underline">Cancel Edit</button>)}


          </div>


      </form>


      

        {/* sections */}
          
        {course.courseContent?.length > 0 && (
            <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
            
          )}

          <div className="flex justify-end gap-x-3">

            <button onClick={goBack} className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>Back</button>

            <IconBtn text="next" onclick={goToNext}> <BiRightArrow/></IconBtn>

          </div>
    </div>
  )
}

export default CourseBuilderForm

