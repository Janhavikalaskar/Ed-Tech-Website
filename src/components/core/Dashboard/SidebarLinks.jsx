import React from 'react';
import * as Icons from "react-icons/vsc";
import { NavLink, useLocation } from 'react-router-dom';
import { matchPath } from 'react-router-dom';


const SidebarLinks = ({link , iconName}) => {
    //agar icon ka name present hai toh aese hum icon ko fetch kar skty hai
    const Icon = Icons[iconName];
    const location = useLocation();

    //function to match route by comparing the passed route and a current location route path
    const matchRoute = (route)=>{
        return matchPath( {path:route},location.pathname);
    }
  return (
    <NavLink to={link.path} className={ ` relative px-8 py-2 text-sm font-medium ${matchRoute(link.path) ?   "bg-yellow-800 text-yellow-50"
    : "bg-opacity-0 text-richblack-300"
} transition-all duration-200`}>
                <span className=  {`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 ${matchRoute(link.path) ? "opacity-100":"opacity-0"}`} ></span>
               
                <div className='flex items-center gap-x-2'>
                    <Icon className="text-lg"/>
                    <span>{link.name}</span>
                   
                </div>
    </NavLink>
  )
}

export default SidebarLinks