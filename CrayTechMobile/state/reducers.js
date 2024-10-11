import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import preferenceSlice from "./preferenceSlice";

const rootReducer = combineReducers({
    auth: authSlice,
    preferences: preferenceSlice,
})

export default rootReducer;