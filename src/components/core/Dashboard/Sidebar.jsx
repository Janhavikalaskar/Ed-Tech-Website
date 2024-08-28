import React, { useState } from 'react'
import  { sidebarLinks } from "../../../data/dashboard-links"
import {logout} from "../../../services/operations/authAPI"
import { useDispatch, useSelector } from 'react-redux'
import SidebarLinks from './SidebarLinks'
import { useNavigate } from 'react-router-dom'
import { VscSignOut } from 'react-icons/vsc'
import ConfirmationModal from '../../common/ConfirmationModal'


const Sidebar = () => {
    const {user , loading:profileLoading} = useSelector( (state)=>state.profile);
    const {loading:authLoading} = useSelector( (state)=>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const[confirmationModal , setConfirmationModal] = useState(null)

    if(profileLoading || authLoading){
        return (
            <div className='spinner'></div>
        )
    }
  return (

    <div >

    <div  className="flex flex-wrap lg:h-[calc(100vh-3.5rem)] min-w-[220px] flex-row lg:flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">

        <div className=' flex flex-row lg:flex-col flex-wrap'>
            {
                sidebarLinks.map( (link)=>{
                    if(link.type && user?.accountType !== link.type ){
                        return null;
                    }
                    return(
                    //user ka jo account type hai aur jo data link ka type hai agar equal hai toh pass kro data
                        <SidebarLinks key={link.id} link={link} iconName={link.icon}/>
                    )
                })
            }
        </div>

        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700"></div>

        <div className='flex flex-col'>
        

            <SidebarLinks link={ {name:"Settings",path:"dashboard/settings"}} iconName="VscSettingsGear"/>

            {/* logout button */}
           <button onClick={ ()=> {
                
                setConfirmationModal({
                text1:"Are you Sure ?",
                text2:"You will be Logged out of your Account",
                btn1Text:"Logout",
                btn2Text:"cancel",
                btn1Handler:() => dispatch(logout(navigate)),
                btn2Handler:() => setConfirmationModal(null)
           })
           }
          
           }  className="px-8 py-2 text-sm font-medium text-richblack-300">

           <div className='flex items-center gap-x-2'>
            <VscSignOut className='text-lg'/>
            <span>Logout</span>
           </div>

           </button>

        </div>


    </div>
    
           {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </div>

  )
}

export default Sidebar