import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import postSlice from "./postSlice";
import themeSlice from "./theme";
import { apiSlice } from "./apiSlice";

const rootReducer = combineReducers({
    user: userSlice,
    theme: themeSlice,
    posts: postSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
});

export { rootReducer };
