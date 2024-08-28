import React, { useState } from 'react'
import {HomePageExplore} from "../../../data/homepage-explore";
import HiglightedText from "./HighlightText";
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const tabsName=[
    "Recent",
    "For Beginner's",
    "People Choice",
    "Desired path",
    "Career paths",
]

const ExploreMore = () => {
    const [currentTab,setCurrentTab] = useState(tabsName[0]);
    

    const [courses , setCourses] = useState(HomePageExplore[0].courses);
   

    const [currentCard , setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);
   
    
    const setMyCards = (currentTab)=>{
        setCurrentTab(currentTab);

        //result contain all courses of current tab
        const result = HomePageExplore.filter((course)=>course.tag === currentTab);
    
        setCourses(result[0].courses);

        setCurrentCard(result[0].courses[0].heading)
    };
  return (
    <div className=' flex flex-col items-center mb-5 mt-5'>

            <div className=' text-4xl font-semibold text-center'>Smart Learning <HiglightedText text={"Bright Future"} />  </div>

            <div className=' text-richblack-300 text-center text-lg  mt-3'>Tomorrow's leaders, today's learners</div>

            {/* tab section */}

            <div className=' hidden lg:flex  justify-center bg-richblack-800  rounded-full mt-6 w-fit mb-5 border-richblack-100 '>
                {
                    tabsName.map( (element, index)=>{
                        return(
                            <div key={index} className={`text-[16px] flex items-center gap-2 
                ${currentTab === element ? "bg-richblack-900 text-richblack-5 font-medium":" text-richblack-200 font-medium"} 
                rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                                    onClick={()=>setMyCards(element)} >
                                {element}
                            </div>
                        )
                    })
                }
            </div>

            <div className="hidden lg:block lg:h-[200px]">


                {/* collection of card */}
                <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">

                {/* signle card */}
                    {

                        courses.map( (SelectedTABcourse ,index)=>{
                            return(

                                <div key={index} className={`w-[360px] lg:w-[30%] ${
                            currentCard === SelectedTABcourse.heading
                     ? " bg-pure-greys-5 shadow-[12px_12px_0_0] shadow-blue-500"
                            : "bg-richblack-800"
                             } text-richblack-25 h-[300px] box-border cursor-pointer`}
                                onClick={()=>setCurrentCard( SelectedTABcourse.heading)}
                                >


                                        <div className="border-b-[2px] border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3"> 

                                        <div  className={` ${
                            currentCard === SelectedTABcourse?.heading && "text-richblack-800"
                             } font-semibold text-[20px]`}>
                                    {SelectedTABcourse.heading}</div>

                                    <div className="text-richblack-400">{SelectedTABcourse.description}</div>

                                    </div>
                                    


                                    <div  className={`flex justify-between ${
                             currentCard === SelectedTABcourse?.heading ? "text-blue-300" : "text-richblack-300"
                                             } px-6 py-3 font-medium`} >
                                    
                                        <div className=' flex flex-row gap-2 items-center text-[16px] '>
                                        <HiUsers /> {SelectedTABcourse.level}</div>
                                       
                                        <div className=' flex flex-row gap-2 items-center text-[16px] '>
                                        <ImTree></ImTree>{SelectedTABcourse.lessionNumber}</div>

                                    </div>





                                </div>
                            )
                        })
                    }
                </div>
            </div>

    </div>
  )
}

export default ExploreMore