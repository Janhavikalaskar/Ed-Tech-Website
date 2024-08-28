// This will prevent authenticated users from accessing this route
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function OpenRoute({ children }) {
  const { token } = useSelector((state) => state.auth)
  //agar token state m token nai hai toh mtlb login nahi hai ,render krwao children 
  if (token === null) {
    
    return children
  } 
//agar token available hai toh dashboard/my-profile vale route par jao kyu ki user logged in hai
  else {
    return <Navigate to="/dashboard/my-profile" />
  }
}

export default OpenRoute