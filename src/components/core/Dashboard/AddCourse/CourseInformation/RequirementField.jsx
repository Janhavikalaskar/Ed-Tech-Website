import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'

const RequirementField = ({name , label , register,errors,setValue,getValues}) => {
    //current requirement state
    const [requirement , setRequirement] = useState("");
    //all requirement list
    const[requirementList,setRequirementList] = useState([]);

    //on add requirement btn
    const handleAddRequirement = ()=>{
        //agar requirement m koi value hai
        if(requirement){
            //us value ko requirement list m daldo
            setRequirementList([...requirementList,requirement]);
            //requirement state ko empty kro
            setRequirement("");
        }
    }

    //will call on clear btn 
    const handleRemoveRequirement = (index)=>{
        console.log(index)
        
        const updatedRequirementList = [...requirementList];

        //index ki value hmesha zero hogi kyu ki phle wala hat jaega o index to 1 index tk slice kro mtlb ek current index value niklegi
        updatedRequirementList.splice(index,1);


        setRequirementList(updatedRequirementList)
    }

    useEffect( ()=>{
        register(name,{required:true})
    },[])

    useEffect( ()=>{
        setValue(name,requirementList)
    },[requirementList])

    return (
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor={name}>
            {label} <sup className="text-pink-200">*</sup>
          </label>
          <div className="flex flex-col items-start space-y-2">
            <input
              type="text"
              id={name}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              className="form-style w-full"
            />
            <button
              type="button"
              onClick={handleAddRequirement}
              className="font-semibold text-yellow-50"
            >
              Add
            </button>
          </div>
          {requirementList.length > 0 && (
            <ul className="mt-2 list-inside list-disc">
              {requirementList.map((requirement, index) => (
                <li key={index} className="flex items-center text-richblack-5">
                  <span>{requirement}</span>
                  <button
                    type="button"
                    className="ml-2 text-xs text-pure-greys-300 "
                    onClick={() => handleRemoveRequirement(index)}
                  >
                    clear
                  </button>
                </li>
              ))}
            </ul>
          )}
          {errors[name] && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              {label} is required
            </span>
          )}
        </div>
      )
}

export default RequirementField