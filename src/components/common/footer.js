import React from 'react'
import Logoimg from "../../assets/Logo/Logo-Full-Light.png"
import {CiFacebook} from "react-icons/ci"
import {PiGoogleLogoFill} from "react-icons/pi"
import {AiOutlineTwitter} from "react-icons/ai"
import {AiOutlineYoutube} from "react-icons/ai"
import {FooterLink2} from "../../data/footer-links"
import { Link } from 'react-router-dom'

// creating content array to use with map function
const BottomFooter = ["Privacy Policy" , "Cookie Policy","Terms"];

const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const footer = () => {

  return (
    // top level div
    <div className=' bg-richblack-800'>

         {/* top footer */}
        <div className=' flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14'>

                {/* content containig div */}
               <div className="border-b w-[100%] flex flex-col lg:flex-row pb-5 border-richblack-700"> 

                        {/*top footer- left section */}
                   <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">

                    {/* first column */}
                   <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">

                    <img src={Logoimg} className='object-contain' alt='logo'></img>
                    <h1 className=' text-richblack-50 font-semibold text-[16px]'>Company</h1>
                    <div className=' flex flex-col'>
                      {["About", "Careers", "Affiliates"].map( (CurrEle,index)=>{
                        return(
                          <div key={index} className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                          ><Link to={CurrEle.toLowerCase()}>{CurrEle}</Link></div>
                        )
                      })}
                    </div>

                    <div className="flex gap-3 text-lg">
                          <CiFacebook/>
                          <PiGoogleLogoFill/>
                          <AiOutlineTwitter/>
                          <AiOutlineYoutube/>
                    </div>

                    <div></div>
                   </div>

                   {/* second column */}
                   <div className=' w-[48%] lg:w-[30%] mb-7 lg:pl-0'>

                      <h1 className="text-richblack-50 font-semibold text-[16px]"> Resources</h1>

                      <div className=' flex flex-col gap-2 mt-2'>
                        {
                          Resources.map(( currEle , index)=>{
                            return(
                              <div key={index} className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                              <Link to={currEle.split(" ").join("-").toLowerCase()}>{currEle}</Link>
                              </div>
                            )
                          })
                        }
                      </div>

                      <h1  className="text-richblack-50 font-semibold text-[16px] mt-7"> Support</h1>
                      <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                      <Link to={"/help-center"}>Help Center</Link>
                      </div>
                   </div>

                    {/* third column */}
                   <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                   
                        <h1 className="text-richblack-50 font-semibold text-[16px]">Plans</h1>
                        <div className=' flex flex-col gap-2 mt-2'>
                              { Plans.map( (currEle , index)=>{
                                return(
                                  <div key={index} className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                                  <Link to={currEle.split(" ").join("-").toLowerCase()}>{currEle}</Link>
                                  </div>
                                )
                              })}
                        </div>

                        <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">Community</h1>
                        <div className='flex flex-col gap-2 mt-2'>
                          { Community.map( (currEle , index)=>{
                            return(
                              <div key={index} className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                              <Link to={currEle.split(" ").join("-").toLowerCase()}>{currEle}</Link>
                              </div>
                            )
                          })}
                        </div>

                   </div>

                  </div>


                        {/*top footer- right section */}
                         <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">

                         {

                          FooterLink2.map( (currEle,index)=>{
                            return(
                              <div key={index} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">

                                {/* main heading title */}
                                <h1 className="text-richblack-50 font-semibold text-[16px]">
                                  {currEle.title}
                                </h1>

                                {/* links */}
                                <div className="flex flex-col gap-2 mt-2">
                                {currEle.links.map( (currLink , index)=>{
                                  return(
                                    <div key={index}
                                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                      <Link to={currLink.link}>{currLink.title}</Link>
                                    </div>
                                  );
                                })}
                                </div>
                              </div>
                            );
                          })
                         }

                        </div>
               </div>
   

        </div>

    {/* bottom footer */}
    <div className=' flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-14 text-sm'>

            <div className=' flex flex-row'>
                 { BottomFooter.map( (currentElement , index)=>{
                  return(
                    <div key={index}  
                  className={` ${BottomFooter.length -1 ===index ? "":"border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"} px-3`}>
                   {/* in this to-> we splited the currentElement by space and join them by using - , which created a url for link tag */}
                    <Link to={currentElement.split(" ").join("-").toLocaleLowerCase()}> {currentElement} </Link>
                    </div>
                  );
                 })}
            </div>

            <div className="text-center">
                  Created by Kalaskar Janhavi & Joshi Prachi
            </div>

    </div>
        
    </div>
  )
}

export default footer