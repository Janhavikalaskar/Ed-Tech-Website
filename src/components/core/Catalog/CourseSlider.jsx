import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';


import Course_Card from './Course_Card'
import "swiper/css"
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay,Navigation, Pagination}  from 'swiper/modules'

const CourseSlider = ({Courses}) => {
 
   
  return (
   <>
    {
        Courses?.length ? (
             <Swiper   slidesPerView={1}
                    loop={true}
                    spaceBetween={200}
                    pagination={true}
                    modules={[Autoplay,Pagination,Navigation]}
                    autoplay={{
                    delay: 1000,
                    disableOnInteraction: false,
                    }}
                    navigation={true}
                    breakpoints={{
                        1024:{slidesPerView:3,}
                    }} className="max-h-[30rem]" >
               {
                Courses.map((course,index)=>(
                    <SwiperSlide key={index}>
                        <Course_Card course={course} Height={"h-[250px]"}/>
                    </SwiperSlide>
                ))
               }
            </Swiper>
        ) : (<p className="text-xl text-richblack-5"> No Course Found</p>)
    }
   </>
  )
}

export default CourseSlider