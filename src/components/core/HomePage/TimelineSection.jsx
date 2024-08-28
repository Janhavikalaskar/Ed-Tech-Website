import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"

const timeline =[{
    Logo:Logo1,
    heading:"Goal Setting",
    Description:"Define clear and achievable Goal"
},
{
    Logo:Logo2,
    heading:"Hardwork",
    Description:"Put in necessary effort and time"
},
{
    Logo:Logo3,
    heading:"Adaptability",
    Description:"The ability to switch is an important skills"
},
{
    Logo:Logo4,
    heading:"Effective Communication",
    Description:"Build Strong relationship and networks with others"
}]

const TimelineSection = () => {
  return (
    <div className='flex flex-col lg:flex-row gap-15 items-center ' >

    {/* left box */}
        <div className=' w-[45%] sm:flex flex-col gap-11 hidden '>

            <div>{
                timeline.map( (element , index )=>{
                    return(
                        <div key={index} className=' flex flex-row gap-6'>

                           <div className='w-[50px] h-[50px] bg-white flex items-center '>
                            <img src={element.Logo} alt='logoImg'></img>
                           </div>

                           <div >
                            <h2 className='font-semibold text-[18px] '>{element.heading}</h2>
                            <p className='text-base'> {element.Description}</p>
                           </div>
                        </div>
                    )
                })
            }</div>
           

        </div>

        {/* right box */}
        <div className='relative shadow-blue-200  '>

        <img src={timelineImage} className=' shadow-white object-cover rounded-lg h-fit' alt='timelineImg'></img>
        
        {/* <div className='absolute bg-caribbeangreen-700 lg:flex text-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-[-50%] hidden'>

            <div className=' flex flex-row gap-5 items-center border-r border-caribbeangreen-300 pl-2'>
                <p className=' text-3xl font-bold'></p>
                <p className=' text-caribbeangreen-300 text-sm'>Learn</p>
            </div>
            <div className=' flex flex-row gap-5 items-center border-r border-caribbeangreen-300 pl-2'>
                <p className=' text-3xl font-bold'></p>
                <p className=' text-caribbeangreen-300 text-sm'>Implement</p>
            </div>

        </div> */}

        </div>
    </div>
  )
}

export default TimelineSection