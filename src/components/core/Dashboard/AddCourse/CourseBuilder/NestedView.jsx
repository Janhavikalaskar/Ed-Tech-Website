import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {RxDropdownMenu} from "react-icons/rx"
import {MdEdit} from "react-icons/md"
import {RiDeleteBin6Line} from "react-icons/ri"
import {BiDownArrow} from "react-icons/bi"
import {AiOutlinePlus} from "react-icons/ai"
import SubSectionModal from './SubSectionModal';
import {deleteSection,deleteSubSection} from "../../../../../services/operations/courseDetailsAPI"
import {setCourse} from "../../../../../slices/courseSlice"
import ConfirmationModal from "../../../../common/ConfirmationModal"

const NestedView = ({handleChangeEditSectionName}) => {

    const {course} = useSelector( (state)=>state.course);
  
    const {token} = useSelector( (state)=>state.auth);
    const dispatch = useDispatch();
    //state to ad sub section
    const [addSubSection , setAddSubSection] = useState(null);
    //viewSubsection ->state to view subsection
    const [viewSubsection,setViewSubSection]=useState(null);
    //to edit subsection 
    const [editSubSection,setEditSubSection] = useState(null);
    //confirmation modal
    const [confirmationModal , setConfirmationModal] = useState(null);

    const handleDeleteSection= async (sectionId)=>{

       
        const result = await deleteSection({sectionId , courseId : course._id} ,token  )
        if(result){
            dispatch(setCourse(result))
        }
        setConfirmationModal(null);

    }

    const handleDeleteSubSection= async(subsectionId , sectionId)=>{
        const response = await deleteSubSection( {subsectionId , sectionId }, token);
        if(response){
            //response m updated subsection ayga , usko course slice k andar coursecontent m jo section hai usme update kr rhee hai
            const updatedCourseContent = course.courseContent.map((section)=>section._id === sectionId ?response :section)
            //updated course content ko course slice m dal dia
            const updatedCourse = {...course , courseContent:updatedCourseContent}
            dispatch(setCourse(updatedCourse))
        }
        setConfirmationModal(null)
    }




  return (

    < >

         <div className="rounded-lg bg-richblack-700 p-6 px-8">

                <div>
            

                {/* section */}
                    {course?.courseContent?.map( (section)=>{
                   
                        return( 
                        <details key={section._id} open>
                           

                            {/* section summary */}
                            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">

                                    {/* section name */}
                                    <div className="flex items-center gap-x-3">                                  
                                        <RxDropdownMenu className="text-2xl text-richblack-50"/>
                                        <p className="font-semibold text-richblack-50">{section.sectionName}</p>
                                    </div>

                                    {/* section btn's */}
                                    <div className="flex items-center gap-x-3">

                                        <button onClick={()=>handleChangeEditSectionName(section.sectionName,section._id)}>
                                               <MdEdit className="text-xl text-richblack-300"/>
                                        </button>

                                        <button onClick={()=>{
                                            setConfirmationModal( {
                                                text1:"Delete this Section",
                                                text2:"All the lecture in this Section will be deleted",
                                                btn1Text:"Delete",
                                                btn2Text:"Cancel",
                                                btn1Handler:()=>handleDeleteSection(section._id),
                                                btn2Handler:()=>setConfirmationModal(null)
                                            })
                                        }}>
                                            <RiDeleteBin6Line className="text-xl text-richblack-300"/>
                                        </button>

                                        <span className="font-medium text-richblack-300">|</span>

                                        <BiDownArrow className={`text-xl text-richblack-300`}/>
                                    </div>

                            </summary>


                            {/* subSection summary */}
                            <div className="px-6 pb-4">
                                {
                                    section.subSection.map( (data,index)=>{
                                       
                                        return( 

                                        
                                            <div key={index} onClick={()=>setViewSubSection(data)} className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2">



                                            {/* subSection name */}
                                            <div className="flex items-center gap-x-3 py-2 ">                                  
                                                     <RxDropdownMenu className="text-2xl text-richblack-50"/>
                                                    <p className="font-semibold text-richblack-50">{data.title}</p>
                                                </div>


                                                    {/* subsection btn's */}
                                                    <div  onClick={ (e)=>e.stopPropagation()} className="flex items-center gap-x-3" >

                                                                <button onClick={ ()=>setEditSubSection({...data , sectionId:section._id})}>
                                                                    <MdEdit className="text-xl text-richblack-300"/>
       
                                                                        </button>


                                                                        <button onClick={()=>{
                                                                            setConfirmationModal( {
                                                                                 text1:"Delete this Sub-Section",
                                                                                     text2:"Current Lecture will be Deleted",
                                                                                             btn1Text:"Delete",
                                                                                         btn2Text:"Cancel",
                                                                                 btn1Handler:()=>handleDeleteSubSection(data._id,section._id),
                                                                                 btn2Handler:()=>setConfirmationModal(null)
                                                                                                         })
                                                                                                }}>
                                                                                 <RiDeleteBin6Line className="text-xl text-richblack-300"/>

                                                                                    </button>

                                                     </div>      


                                             </div>

                                         

                                        )
                                     
                                    })
                                }

                                {/* add lecture btn */}
                                <button onClick={()=>setAddSubSection(section._id)} className="mt-3 flex items-center gap-x-1 text-yellow-50">
                                    <AiOutlinePlus className="text-lg"/>
                                    <p>Add Lecture</p>
                                </button>

                            </div>


                        </details>)
                    })}
                </div>

         </div>

        {/* subsection modal */}
         {addSubSection ? (<SubSectionModal modalData={addSubSection} setModalData={setAddSubSection} add={true}/>) :
          viewSubsection ? (<SubSectionModal modalData={viewSubsection} setModalData={setViewSubSection} view={true} />) : 
          editSubSection ? (<SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true}/>) : 
          (<></>)}

        {/* confirmation modal */}
        
          {confirmationModal ? (<ConfirmationModal modalData={confirmationModal}/>):(<></>)}

    </>
  )
}

export default NestedView

