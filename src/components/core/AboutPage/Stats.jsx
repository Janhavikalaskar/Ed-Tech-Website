import React from 'react'

const StatsData = [
    {count: "Sanvi Tech" , label:"Web Developer"},
    {count: "Oasis Infobyte" , label:"Web Developer"},
    {count: "Enord Pvt Ltd" , label:"Web Developer"},
    {count: "Compliance Easy" , label:"Free-lancer"},
]

const Stats = () => {
    return (
        <div className="bg-richblack-700">
        <div className=' flex content-center justify-center  items-center  mt-4'>"Working Experience"</div>
          {/* Stats */}
          <div className="flex flex-col gap-10 justify-between w-11/12 max-w-maxContent text-white mx-auto ">
            <div className="grid grid-cols-2 md:grid-cols-4 text-center">
              {StatsData.map((data, index) => {
                return (
                  <div className="flex flex-col py-10" key={index}>
                    <h1 className="text-[18px]  font-semibold text-richblack-5">
                      {data.count}
                    </h1>
                    <h2 className="font-semibold text-[16px] text-richblack-500">
                      {data.label}
                    </h2>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
}

export default Stats