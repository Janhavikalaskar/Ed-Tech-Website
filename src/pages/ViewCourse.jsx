import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {getFullDetailsOfCourse} from "../services/operations/courseDetailsAPI"
import {setCompletedLectures, setCourseSectionData , setEntireCourseData, setTotalNoOfLectures} from "../slices/viewCourseSlice"
import VideoDetailsSideBar from '../components/core/ViewCourse/VideoDetailsSideBar';
import { Outlet } from 'react-router-dom';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';

const ViewCourse = () => {

    const [reviewModal , setReviewModal] = useState(false);

    const {courseId} =useParams();
    
    const{token} = useSelector( (state)=>state.auth);
    const dispatch = useDispatch()

    const{
      courseSectionData,
      courseEntireData,
      totalNoOfLecutres,
      completedLectures
  }=useSelector( (state)=>state.viewCourse);

    useEffect( ()=>{
      const setCourseSpecificDetails = async ()=>{

        const courseData = await getFullDetailsOfCourse(courseId ,token);
     
        dispatch(setCourseSectionData(courseData?.courseDetails.courseContent));
        dispatch(setEntireCourseData(courseData?.courseDetails));
        dispatch(setCompletedLectures(courseData?.completedVideos));
        let lectures =0;
        console.log(courseData)
        courseData?.courseDetails.courseContent.forEach( (section)=>{
          lectures = section.subSection.length
         
        })
        dispatch(setTotalNoOfLectures(lectures));
      }

      setCourseSpecificDetails();

    },[])


  return (
    <>

        <div className="relative flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)] ">

                <VideoDetailsSideBar setReviewModal={setReviewModal}/>

                <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        {/* jo bhi component present hoga ViewCourse route k andar jo show krwao */}
        <div className="mx-6">
        <Outlet/>
        </div>
                  
                </div>


                
              

        </div>
        {reviewModal &&  (<CourseReviewModal setReviewModal={setReviewModal}/>) }
        

    </>
  )
}

export default ViewCourse