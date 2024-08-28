import React from 'react'
import CtaButton from "./Button"
import HighlightText from "./HighlightText"
import Know_progress from "../../../assets/Images/Know_your_progress.png"
import compare_others from "../../../assets/Images/Compare_with_others.png"
import plan_lessons from "../../../assets/Images/Plan_your_lessons.png"

const LearningLanguageSection = () => {
  return (
    <div className=' w-11/12  flex flex-col max-w-maxContent gap-5 mt-[120px] mb-[120px]'>

          <div className='text-4xl font-semibold text-center'> Your swiss knife for <HighlightText text={"learning any language"}></HighlightText></div>

          <div className=' text-center text-richblack-600 mx-auto text-base mt-3 font-medium w-[70%]'>Using spin manking learning multiple languages easy with 20+ languages realistic voice-over, progress tracking, custom schedule and more</div>

          <div className=' flex items-center justify-center mt-5'>

            <img src={Know_progress} className='object-contain translate-x-[125px] z-0 translate-y-[-30px]' alt='knowProgressImg'></img>
            <img src={compare_others} className='object-contain z-10' alt='compareImg'></img>
            <img src={plan_lessons} className='object-contain translate-x-[-150px] z-30' alt='PlanlessonImg'></img>

          </div>
          

          <div className=' flex justify-center  text-base'> <CtaButton active={true} linkto={"/signup"}><div> Learn more</div></CtaButton></div>
          


    </div>
  )
}

export default LearningLanguageSection