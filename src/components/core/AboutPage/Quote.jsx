import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
  return (
  
    <div className=" text-xl md:text-2xl font-semibold mx-auto py-5 pb-20 text-center text-white">
    We are passionate about revolutionizing the way we learn. Our
    innovative platform <HighlightText text={"combines technology"} />,{" "}
    <span className="bg-gradient-to-b from-[#4b74b5] to-[#4f19f0] text-transparent bg-clip-text font-bold">
        {" "}
        expertise
    </span>
    , and community to create an
    <span className="bg-gradient-to-b from-[#0c00e6] to-[#23f96a] text-transparent bg-clip-text font-bold">
        {" "}
        unparalleled educational
    experience.
    </span> 
</div>
   
  )
}

export default Quote