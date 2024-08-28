import React from 'react';
import { Link } from 'react-router-dom';
import {FaArrowRight} from "react-icons/fa"
import HighlighText  from "../components/core/HomePage/HighlightText"
import CTAButton from '../components/core/HomePage/Button';
import Banner from "../assets/Images/banner.mp4"
import Footer from '../components/common/footer';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import TimelineSection from '../components/core/HomePage/TimelineSection';
import InstructorSection from '../components/core/HomePage/InstructorSection'
import ExploreMore from '../components/core/HomePage/ExploreMore';
import ReviewSlider from "../components/common/ReviewSlider"

const Home = () => {
  return (
    <div>

    {/*section 1*/}
      <div className=' max-w-maxContent relative mx-auto flex flex-col w-11/12 items-center text-white justify-between'>

            

             <div className='  text-4xl font-semibold mt-8'>
              Learn to 
              <HighlighText text={"Code"}/>
             </div>


              <div className=' mt-4 w-[90%] text-center text-lg font-bold text-richblack-500'>
              Your Future 
              </div>

              {/* <div className=' flex flex-row gap-7 mt-8'> 
                    <CTAButton active={true} linkto={"/signup"}> Learn More</CTAButton>
                    <CTAButton active={false} linkto={"/signup"}>Book a Demo</CTAButton>

              </div> */}

              <Link to={"/signup"}>
              <div className="group mt-8 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all-duration-200 hover:scale-95 w-fit ">
                <div className=' flex flex-row items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblack-900 shadow-inner '>
                  <p>Create Account</p>
                  <FaArrowRight></FaArrowRight>
                </div>
              </div>
             </Link>
             
              <div className=' mx-3 my-12  shadow-caribbeangreen-300 shadow-md'>
              <video muted loop autoPlay>
                  <source src={Banner} type='video/mp4'></source>
                </video>
              </div>

              
              <ExploreMore></ExploreMore>

              
              
      </div>


    {/*section 2*/}
    <div  className=' bg-pure-greys-5 text-richblack-700  text-gree'>

    <div className='homepage_bg h-[310px] '>

      <div className=' w-11/12 max-w-maxContent flex items-center gap-5 mx-auto flex-col '>
        <div className=' h-[150px]'></div>
        <div className=' flex text-white gap-7 mt-10 '>

                 <CTAButton active={true} linkto={"/signup"}>
                 <div className=' flex gap-3 items-center'>
                 {"Explore"} <FaArrowRight/>
                 </div> 
                 </CTAButton>

                 <CTAButton active={false} linkto={"/signup"}>{"Learn Now"}</CTAButton>
        </div>

      </div>

    </div>

    <div className=' mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7 flex-wrap'>

      <div className=' flex flex-row gap-5 mt-[95px] mb-[95px]  '>

      {/* <div className=' text-4xl font-semibold w-[45%]'>
         <HighlighText text={"Be a Change"}></HighlighText>
      </div>

      <div className=' flex flex-col gap-10 w-[40%] items-start '>
        <div className=' text-[16px]'> 
        </div>
        <CTAButton active={true} linkto={"/signup"}><div>Learn Now</div></CTAButton>
      </div> */}

      </div>

          <TimelineSection></TimelineSection>

          <LearningLanguageSection></LearningLanguageSection>


    </div>

                {/* coding section */}
    <div className='  w-11/12 max-w-maxContent'>
                {/*code section 1*/}
              {/* <div>
                <CodeBlocks position={"lg:flex-row"}
                 heading={<div className='text-4xl font-semibold'>Unlock Your <HighlighText text={"coding potential"}></HighlighText>with our online courses</div>} 
                 subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                 ctabtn1={
                 {
                  active:true,
                  btnText:"Try it Yourself",
                  linkto:"/signup",
                  
                 }
                 }
                 ctabtn2={
                 {
                  btnText:"Learn more",
                  linkto:"/signup",
                  active:false,
                 }
                 }
                 CodeBlock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`}
                 codeColor={"text-yellow-25"}
                 ></CodeBlocks>
              </div> */}

               {/*code section 2*/}
               {/* <div className=' ml-40 '>
                <CodeBlocks position={"lg:flex-row-reverse"}
                 heading={<div className='text-4xl font-semibold'> Kick start your <HighlighText text={"coding Journey"}></HighlighText></div>} 
                 subheading={" Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                 ctabtn1={
                 {
                  active:true,
                  btnText:"Continue ",
                  linkto:"/signup",
                  
                 }
                 }
                 ctabtn2={
                 {
                  btnText:"Learning",
                  linkto:"/signup",
                  active:true,
                 }
                 }
                 CodeBlock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`}
                 codeColor={" text-green-300"}
                 ></CodeBlocks>
              </div> */}


              </div>

    </div>

    {/*section 3*/}
    <div className=' relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white '>

    <InstructorSection></InstructorSection>

    <h2 className=' text-center text-4xl font-semibold mt-10 '>Review's</h2>

    {/* <review slider></review> */}
    <ReviewSlider/>

    </div>
    
    {/* footer */}
    <Footer></Footer>
  

    </div>
  )
};

export default Home