import React from 'react'
import HighlightText from '../components/core/HomePage/HighlightText'
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"
import Quote from '../components/core/AboutPage/Quote'
import FoundingStory from '../assets/Images/FoundingStory.png'
import Stats from '../components/core/AboutPage/Stats'
import LearningGrid from '../components/core/AboutPage/LearningGrid'
import Footer from '../components/common/footer'
import ContactForm from '../components/core/AboutPage/ContactForm'

const About = () => {
  return (
    <div>
   

{/* section 1  */}
<section className="bg-richblack-700">

        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">

          <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
            Driving Innovation in Online Education for a
            <HighlightText text={"Brighter Future"} />
            <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
            "Empower your learning journey with our cutting-edge EdTech platform. Explore interactive courses, personalized assessments, and innovative tools designed to enhance your education experience. Join a community of learners dedicated to unlocking their full potential. 
            Embrace the future of education with us!"
            </p>
          </header>

          <div className="sm:h-[70px] lg:h-[150px]"></div>

          <div className="hidden absolute bottom-0 left-[50%] sm:grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5 ">
            <img src={BannerImage1} alt="" className='w-[400px] h-[235px]'/>
            <img src={BannerImage2} alt="" />
            <img src={BannerImage3} alt="" className='w-[360px] h-[235px]' />
          </div>
          
        </div>
      </section>


{/* section 2 */}
<section className="border-b border-richblack-700">

  <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
  <div className="h-[100px] "></div>
    <Quote/>
  </div>
</section>

{/* section 3 */}
<section>

  <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">

    {/* founding story div */}
    <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">

      {/* founding Story left box */}
      <div className="my-24 flex lg:w-[50%] flex-col gap-10">

        <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
          Our Story
        </h1>
        <p className="text-base font-medium text-richblack-300 lg:w-[95%]">In the heart of my academic journey as a BTech student, 
        a passion for technology and a thirst for knowledge propelled me towards mastering the intricacies of the MERN stack. Through three enriching internships and a rewarding freelance project, I honed my skills and gained practical insights into the dynamic world of web development.
         Inspired by the transformative potential of technology, the vision for my personal project began to take shape.</p>

         <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
         The founding story of this endeavor is a testament to the fusion of education, experience, and enthusiasm. Driven by the desire to create something meaningful,
          I embarked on a journey to leverage my MERN stack expertise. This project aims not only to showcase my proficiency but also to contribute value to the tech community. It reflects the culmination of my academic endeavors and practical experiences, symbolizing the passion that fuels innovation.
          Join me on this exciting venture as we explore the boundless possibilities that lie at the intersection of technology and creativity.
         </p>

      </div>
      {/* founding Story right box */}
      <div>
        <img src={FoundingStory} alt='foundingstoryimg' className="shadow-[0_0_20px_0] shadow-[#FC6767] w-[80%]  rounded-full"/>
      </div>

    </div>

    {/* experience stats */}
    <Stats/>

    {/* vision and mission div */}
    <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">

    

        {/* left box */}
        <div className="my-24 flex lg:w-[40%] flex-col gap-10">
          <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
               Future Scope
          </h1>

          <p className="text-base font-medium text-richblack-300 lg:w-[95%]">With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. 
          Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines 
          cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.</p>
        </div>

        {/* right box */}
        <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
                   Aim
              </h1>

              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
              our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, 
              where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, 
              and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
              </p>
        </div>

    </div>

  </div>

</section>

        {/* section 4 */}
     

        {/* section 5 */}
          <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
          <LearningGrid/>
          <ContactForm/>
              </section>

              <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviws from Other Learner */}
        {/* <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1> */}
        {/* <ReviewSlider /> */}
      </div>

     

                {/* footer section */}
                <Footer/>

    </div>
    

    
  )
}

export default About