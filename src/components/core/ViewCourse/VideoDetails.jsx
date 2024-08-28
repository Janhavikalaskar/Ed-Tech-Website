import React, { useEffect, useRef, useState } from 'react' 
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { Player } from 'video-react';
import "video-react/dist/video-react.css";
import {AiFillPlayCircle} from "react-icons/ai"
import IconBtn from '../../common/IconBtn';

const VideoDetails = () => {

  const {courseId , sectionId , subSectionId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef();
  const {token} = useSelector( (state)=>state.auth);
  const {courseSectionData , courseEntireData , completedLectures} = useSelector( (state)=>state.viewCourse);
  const location = useLocation()
  const [videoData , setVideoData] = useState([]);
  const [videoEnded , setVideoEnded] = useState(false);
  const [loading , setLoading] = useState(false);
  const [previewSource, setPreviewSource] = useState("")

  

  useEffect ( ()=>{

    const setVideoSpecificDetails = async()=>{

      if(!courseSectionData.length){
        return;
      }
    
      if(!courseId && !sectionId && !subSectionId){ 
        navigate("/dashboard/enrolled-courses");
      }
      else{
        //when all three fields are present

        //filtering section data by section id
        const filteredData = courseSectionData?.filter(
          (section)=>section._id === sectionId
        )

        //filtering video data by using section data
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data)=>data._id === subSectionId
        )
console.log(filteredVideoData)
        
        setVideoData(filteredVideoData?.[0]);
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false);
      }
    }
    setVideoSpecificDetails()
  },[courseSectionData,courseEntireData,location.pathname])

  const isFirstVideo=()=>{
    const currentSectionIndex = courseSectionData.findIndex(
      (data)=>data._id === sectionId
    )
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data)=>data._id === subSectionId
    )

    if(currentSectionIndex === 0 && currentSubSectionIndex===0){
      return true;
    }
    else{
      return false
    }
  }

  const isLastVideo = ()=>{
    const currentSectionIndex = courseSectionData.findIndex(
      (data)=>data._id === sectionId
    )

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data)=>data._id === subSectionId
    )

    if(currentSectionIndex === courseSectionData.length -1 && currentSubSectionIndex === noOfSubSections -1){
      return true
    }
    else{
      return false
    }


  }

  const goToNextVideo = ()=>{

    const currentSectionIndex = courseSectionData.findIndex(
      (data)=>data._id === sectionId
    )

    const noOfSubSections = courseSectionData[currentSectionIndex]?.subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data)=>data._id === subSectionId
    )

    if(currentSubSectionIndex !== noOfSubSections -1){
      //same section k andar aur subsection hai usme jao
      const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex +1]._id;
      //is video par jana
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
    }
    else{
      //different section ki first video
      const nextSectionId = courseSectionData[currentSectionIndex +1]._id;
      const firstSubSectionId = courseSectionData[currentSectionIndex +1].subSection[0]._id;
      //ess video par chle jao
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${firstSubSectionId}`)
    }


  }

  const goToPreviousVideo = ()=>{
    
    const currentSectionIndex = courseSectionData.findIndex(
      (data)=>data?._id === sectionId
    )

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data)=>data?._id === subSectionId
    )

    if(currentSubSectionIndex !== 0){
      //same section ki previous video id
      const prevSubSectionId = courseSectionData[currentSectionIndex]?.subSection[currentSubSectionIndex-1]?._id;
      //ess video par chle jao
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
    }
    else{
      //different section last video
      const prevSectionId = courseSectionData[currentSectionIndex -1]._id;
      const prevSubSectionLength = courseSectionData[currentSectionIndex -1].subSection.length;
      const prevSubSectionId = courseSectionData[currentSectionIndex -1].subSection[prevSubSectionLength-1]._id;
    
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
    }
    

  }

  const handleLecutreCompletion = async ()=>{
    setLoading(true);

    const res = await markLectureAsComplete( {courseId:courseId , subSectionId:subSectionId} , token);

    //state update
    if(res){
      dispatch(updateCompletedLectures(subSectionId));
    }

    setLoading(false);

  }

  return (
    <div className="flex flex-col gap-5 text-white">
          {
            !videoData ? (
              <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
           ) 
            :(
              <Player ref = {playerRef}
                      
                      playsInline
                      onEnded={()=>setVideoEnded(true)}
                      src={videoData?.videoUrl}
                      >

                  <AiFillPlayCircle />

                  {
                    videoEnded && (
                      <div  style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter">
                        {
                          !completedLectures.includes(subSectionId) && (
                            <IconBtn disabled={loading} onclick={()=>handleLecutreCompletion()}
                              text={!loading ? "Mark as Completed":"Loading..." } customClasses="text-xl max-w-max px-4 mx-auto"
                            />
                          )
                        }

                        <IconBtn disabled={loading} onclick={()=>{
                          if(playerRef?.current){
                            // set the current time of the video to 0
                            playerRef.current?.seek(0);
                            setVideoEnded(false)
                          }
                        }} text="Rewatch"  customClasses="text-xl max-w-max px-4 mx-auto mt-2"/>


                        <div>
                          {
                            !isFirstVideo()&&(
                              <button disabled={loading} onClick={goToPreviousVideo} className='blackButton'>
                                Prev
                              </button>
                            )
                          }

                          {
                            !isLastVideo()&&(
                              <button disabled={loading} onClick={goToNextVideo} className='blackButton'>Next</button>
                            )
                          }
                        </div>

                          
                      </div>
                    )
                  }

                     
              </Player>
            )
          }

          <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
          <p className="pt-2 pb-6">{videoData?.description}</p>

    </div>
  )
}

export default VideoDetails