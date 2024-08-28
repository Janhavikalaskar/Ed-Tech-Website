import React from 'react'
import { toast } from 'react-hot-toast';
import {apiConnector} from "../apiConnector"
import { catalogData} from "../api"

export const getCatalogPageData = async (categoryId) => {
    const toastId = toast.loading("Loading...")
    let result = [];
    try{
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,{categoryId:categoryId,});
        if(!response?.data?.success){
            throw new Error("unable to fetch category data");
        }
         result = response?.data
    }
    catch(err){
        console.log("cata log page data api err",err);
        toast.error(err.message);
        result = err.response?.data
    }
    toast.dismiss(toastId);
   return result 
}

