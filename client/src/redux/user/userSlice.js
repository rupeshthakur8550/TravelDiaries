import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) =>{
            state.loading = true;
            state.error= null;
        },
        signInSuccess: (state, action)=>{
            state.currentUser =action.payload;
            state.loading = false;
            state.error= null;
        },
        signInFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state, action)=>{
            state.loading = true;
            state.error= null;
        },
        updateSuccess: (state, action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error= null;
        },
        updateFaillure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state, action)=>{
            state.loading = true;
            state.error= null;
        },
        deleteUserSuccess: (state, action)=>{
            state.currentUser = null;
            state.loading = false;
            state.error= null;
        },
        deleteUserFaillure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        signoutSuccess: (state)=>{
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
    }
});

export const {signInFailure, signInStart, signInSuccess, updateStart, updateSuccess, updateFaillure, deleteUserStart, deleteUserFaillure, deleteUserSuccess, signoutSuccess} = userSlice.actions;

export default userSlice.reducer;