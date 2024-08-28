import React, { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux';
import {toast} from "react-hot-toast";
import {createSubSection, updateSubSection} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from '../../../../../slices/courseSlice';
import {RxCross1} from "react-icons/rx";
import Upload from "./Upload"
import IconBtn from "../../../../common/IconBtn"
import { useSelector } from 'react-redux';




const SubSectionModal = ({modalData , setModalData , add=false , view=false , edit=false}) => {

    const {register , handleSubmit , setValue , formState:{errors},getValues} = useForm();

    const dispatch = useDispatch();  

    const [loading , setLoading] = useState(false);

    const {course} = useSelector( (state)=>state.course);
  
    const {token} = useSelector( (state)=>state.auth);

    //phle render par form ki values set krdo jo modal data m present hai
    useEffect( ()=>{
      if(view || edit){
        setValue("lectureTitle",modalData.title);
        setValue("lectureDesc",modalData.description);
        setValue("lectureVideo",modalData.videoUrl);
      }
    },[])

    //kya form update hua hai ya nai
    const isFormUpdated = ()=>{
      const formAllCurrvalues = getValues();
      //agar form ki current value modal data ki current value k equal nahi hai toh mtlb form update hua hai 
      if(formAllCurrvalues.lectureTitle !== modalData.title || 
        formAllCurrvalues.lectureDesc !== modalData.description || 
        formAllCurrvalues.lectureVideo !== modalData.videoUrl){
          return true;
      }
      else{
        return false;
      }

    }

    const onSubmit = async (data)=>{

      if(view){
        return;
      }

      if(edit){

        if(!isFormUpdated){
          toast.error("No changes made to form");
        }else{
          //edit kro
          handleEditSubSection();
        }
        return
      }

  
       //agar add kar rhe hai subsection ko
       const formData = new FormData();
       formData.append("sectionId",modalData);
       formData.append("title",data.lectureTitle);
       formData.append("description",data.lectureDesc);
       formData.append("video",data.lectureVideo);
       setLoading(true);
       //api call
       const result = await createSubSection(formData ,token);

       if(result){
         const updatedCourseContent = course.courseContent.map((section) =>{
          return(
            (section._id === modalData? result : section)
          )
         }
       )
     
       const updatedCourse = { ...course, courseContent: updatedCourseContent }
    
       dispatch(setCourse(updatedCourse))
       
       }
       setModalData(null);
       setLoading(false)
  

    }


 // handle the editing of subsection
    const handleEditSubSection = async()=>{
      const currentValues = getValues();
      const formData = new FormData();

      //modal data is data came from backend present in course state

      formData.append("sectionId",modalData.sectionId);
      formData.append("subSectionId",modalData._id);

      if(currentValues.lectureTitle !== modalData.title){
        formData.append("title",currentValues.lectureTitle)
      }

      if(currentValues.lectureDesc !== modalData.description){
        formData.append("description",currentValues.lectureDesc)
      }

      if(currentValues.lectureVideo !== modalData.videoUrl){
        formData.append("video",currentValues.lectureVideo)
      }

      setLoading(true);
      const result = await updateSubSection(formData ,token);
   
      if(result){
        const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
      }
      setModalData(null);
      setLoading(false);
    }
    
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
          <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">

 {/* Modal Header */}
                <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                  <p className="text-xl font-semibold text-richblack-5"> {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture</p>
                  <button onClick={()=>(!loading ? setModalData(null):{})} >
                    <RxCross1 className="text-2xl text-richblack-5"/>
                  </button>
                </div>

                {/* modal form */}
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">


                        <Upload name="lectureVideo" label="Lecture Video" register={register} setValue={setValue} errors={errors} video={true}
                        //view or edit false hai toh video nai dikhegi
                          viewData={view? modalData.videoUrl:null} editData={edit?modalData.videoUrl:null} 
                        />


                <div className="flex flex-col space-y-2">
                  <label htmlFor='lectureTitle' className="text-sm text-richblack-5" >Lecture Title <sup className="text-pink-200">*</sup></label>
                  <input id='lectureTitle' placeholder='Enter Lecture Title' {...register("lectureTitle",{required:true})}  className="form-style w-full"/>
                  {
                    errors.lectureTitle &&(
                      <span className="ml-2 text-xs tracking-wide text-pink-200">Lecture Title is required</span>
                    )
                  }
                </div>


                  <div className="flex flex-col space-y-2">
                        <label className="text-sm text-richblack-5" htmlFor='lectureDesc'>Lecture Description   {!view && <sup className="text-pink-200">*</sup>} </label>
                        <textarea id='lectureDesc' placeholder='Enter Lecture Description' {...register("lectureDesc",{required:true})}  className="form-style resize-x-none min-h-[130px] w-full"/>
                        {
                          errors.lectureDesc && (
                            <span className="ml-2 text-xs tracking-wide text-pink-200">Lecture Description is required</span>
                          )
                        }
                  </div>



                  {
                    !view && (
                      <div className="flex justify-end">
                        <IconBtn text={loading ? "loading" :edit ? "Save Changes":"Save"}/>
                      </div>
                    )
                  }


              </form>

          </div>
    </div>
  )
}

export default SubSectionModal