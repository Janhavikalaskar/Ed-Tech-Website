
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const token = useSelector( (state)=>state.auth.token);
    //token agar null nai hai toh children return krne hai
    if(token!== null){
        return children
    }
    else{
        return <Navigate to="/login"/>
    }
}

export default PrivateRoute