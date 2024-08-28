import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from "../../common/IconBtn"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"


const VideoDetailsSideBar = ( {setReviewModal}) => {
  
    const [activeStatus , setActiveStatus] = useState("");
    const [videoBarActive,setvideoBarActive] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const {sectionId,subSectionId} = useParams();
    const{
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures
    }=useSelector( (state)=>state.viewCourse);



    useEffect( ()=>{
        ;(()=>{
            if(!courseSectionData.length)
            return;
            // current section ka index nikala
            const currentSectionIndex = courseSectionData.findIndex(
                (data)=>data._id === sectionId)
            //current subsection ka index nikala 
            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
                (data)=>data._id === subSectionId
            )
            //current lecture id nikali
            const acitveSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id;
            //set current section id here
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
            //set current lecture here
            setvideoBarActive(acitveSubSectionId);
        })()
    },[courseSectionData , courseEntireData , location.pathname])

  return (
    <>

            <div className="flex lg:h-[calc(100vh-3.5rem)] lg:w-[320px] w-full  lg:max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">

                {/* //for btns and heading */}
                <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">

                            {/* for btns */}
                            <div className="flex w-full items-center justify-between ">
                                    <div onClick={()=>navigate("/dashboard/enrolled-courses")}  className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90" title="back">
                                    <IoIosArrowBack size={30} />
                                    </div>

                                    
                                        <IconBtn customClasses={"ml-auto"} text="Add Review"   onclick={() => setReviewModal(true)}/>
                                   

                             </div>

                                     {/* for heading and titles */}

                                        <div className="flex flex-col">

                                           <p>{courseEntireData?.courseName}</p>
                                           <p className="text-sm font-semibold text-richblack-500">{completedLectures?.length}/{totalNoOfLectures}</p>
                                          
                                        </div>

                           
                </div>

                {/* for sections and subsections */}
                <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
                    {
                        courseSectionData.map( (section,index)=>(
                            <div onClick={()=>setActiveStatus(section?._id)} key={index} className="mt-2 cursor-pointer text-sm text-richblack-5">

                                    {/* section */}
                                    <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                                        <div className="w-[70%] font-semibold">
                                            {section?.sectionName}
                                        </div>

                                        <div className="flex items-center gap-3">
                  {/* <span className="text-[12px] font-medium">
                    Lession {course?.subSection.length}
                  </span> */}
                  <span
                    className={`${
                      activeStatus === section?.sectionName
                        ? "rotate-0"
                        : "rotate-180"
                    } transition-all duration-500`}
                  >
                    <BsChevronDown />
                  </span>
                </div>
                                    </div>

                                    {/* subSection */}
                                    <div className="transition-[height] duration-500 ease-in-out">
                                    {/* agar current section par ho tbhi sub section show kro */}
                                        {
                                            
                                            activeStatus === section?._id && (
                                                <div>
                                                    { 
                                                        section.subSection.map( (topic,index)=>{
                                                           
                                                           return(
                                                            <div 
                                                             key={index} onClick={()=>{
                                                                navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`)
                                                                setvideoBarActive(topic?._id)
                                                            }}
                                                            className={`flex gap-3  px-5 py-2 ${
                        videoBarActive === topic._id
                          ? "bg-yellow-200 font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"
                      } `}>
                                                                <input
                                                                 type='checkbox'
                                                                  checked={completedLectures.includes(topic?._id)}
                                                                    onChange={()=>{}}
                                                                />
                                                              
                                                                <span>
                                                                    {topic.title}
                                                                   
                                                                </span>
                                                            </div>
                                                           )
                                                        })
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                            </div>
                        ))
                    }
                </div>

            </div>
         
    </>
  )
}

export default VideoDetailsSideBar