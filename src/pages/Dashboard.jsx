import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Dashboard/Sidebar';

const Dashboard = () => {
    const authLoading = useSelector( (state)=> state.auth.loading);
    const profileLoading = useSelector( (state)=>state.profile.loading);

    if(profileLoading || authLoading){
        return (
            <div className='spinner'></div>
        )
    }
  return (
    <div className="relative  flex-wrap flex min-h-[calc(100vh-3.5rem)]">

            <Sidebar/>

            <div className='h-[calc(100vh-3.5rem)] overflow-auto flex-1 '>
                    <div className=' mx-auto w-11/12 max-w-[1000px] py-10'>
                    <Outlet/>
                    </div>
            </div>

    </div>
  )
}

export default Dashboard