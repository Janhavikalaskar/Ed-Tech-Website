import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    signupData: null,
    loading: false,
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
}

const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
    
            setSignupData:(state, action) =>{
                state.signupData = action.payload;
              },
              setLoading(state, action) {
                //current state m jo loading property hai usme jo current value update hui hai vo daldo
                state.loading = action.payload;
              },
            setToken(state,value){
                state.token = value.payload
            }
        
    }
})

export const {setToken , setSignupData , setLoading} = authSlice.actions;

export default authSlice.reducer;