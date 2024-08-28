import React from 'react';
import Footer from "../components/common/footer"
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { apiConnector } from '../services/apiConnector';
import { categories } from '../services/api';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import Course_Card from '../components/core/Catalog/Course_Card';


const Catalog = () => {

  const {catalogName} = useParams();
  const [catalogPageData , setCatalogPageData] = useState(null);
  const [categoryId , setCategoryId] = useState("");
  const [active, setActive] = useState(1);

  //fetch all categories , y tab call hoga jab catalogName ki value change hogi,
  useEffect(()=>{
    try{
    //sari categories fetch hogi
    const getCategories = async()=>{
      const res = await apiConnector("GET",categories.CATEGORIES_API);
      //current category id nikali sari category se current catalog name compare krwa kar
      //yaha filter karengy agar jo category selected hai aur res m vo miljaegi toh usko category_id m daldengy vrna empty array daljaega category_id m
      const category_id = res?.data?.data?.filter( (ct)=>ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
    
      setCategoryId(category_id)
     
     
    }
    getCategories()
    }
    catch(err){
      console.log("fetch categories error",err)
    }

  },[catalogName])


  //fetching selected category details by using category id
  useEffect( ()=>{
    const getcategoryDetails = async()=>{
      try{
        const response = await getCatalogPageData(categoryId);
        console.log(response)
        setCatalogPageData(response);
      }
      catch(err){
        console.log("get category details error",err)
      }
    }
   
    //if condition eslie lgai taki agar categoryId selected nai hai toh usme empty array put hoga filter se,toh agar empty array hai toh call na ho
    if(categoryId){
      getcategoryDetails()
    }
    

  },[categoryId])

  return (
    <div className=" box-content bg-richblack-800 px-4">

          <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
              <p className="text-sm text-richblack-300">{`Home / Catalog`} <span className="text-yellow-25">{catalogPageData?.data?.selectedCategory?.name}</span></p>
              <p className="text-3xl text-richblack-5">{catalogPageData?.data?.selectedCategory?.name}</p>
              <p className="max-w-[870px] text-richblack-200">{catalogPageData?.data?.selectedCategory?.description}</p>
          </div>


          <div>

              {/* section 1 */}
              <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">Courses to get you Started</div>
                    <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                          <p className={`px-4 py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}>Most Popular</p>
                          <p  className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(2)}>New</p>
                    </div>
                    <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses}/>
              </div>

              {/* section 2 */}
              <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <p className="section_heading">Top Courses in {catalogPageData?.data?.selectedCategory?.name}</p>
                <div className="py-8">
                  <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}/>
                </div>
              </div>

              {/* section 3 */}
              <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className='section_heading'>Frequently Bought </div>
                    <div className="py-8 ">
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-[30px] '>

{
  catalogPageData?.data?.mostSellingCourses?.slice(0,4).map((course,index)=>(
    <Course_Card course={course} key={index} Height={"h-[400px]"}/>
  ))
}

</div>
                    </div>
                          

                    
              </div>

          </div>

          <Footer/>
          

    </div>
  )
}

export default Catalog