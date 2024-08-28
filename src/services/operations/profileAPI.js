import { toast } from "react-hot-toast";
import {profileEndpoints} from "../api"
import { apiConnector } from "../apiConnector";

const{GET_USER_DETAILS_API,GET_USER_ENROLLED_COURSES_API , GET_INSTRUCTOR_DATA_API} = profileEndpoints;

export async  function getEnrolledCourses(token){
    const toastId = toast.loading("Loading...")
    let result = [];
    try{
        const response =  await apiConnector("GET", GET_USER_ENROLLED_COURSES_API,null,{
            //sending token in header
            Authorization: `Bearer ${token}`,
        })
        console.log(response)
 
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        result = response.data.data
        console.log(result)
    }
    catch(error){
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
    }
    toast.dismiss(toastId)
    return result
}


export async function getInstructorData(token) {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
      const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)

      result = response?.data.courses
      console.log("instructor data",result)
    } catch (error) {
      console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
      toast.error("Could Not Get Instructor Data")
    }
    toast.dismiss(toastId)
    return result
  }
  