import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // posts: [],
    posts: {},
    // edit: false,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        getPost: (state, action) => {
            state.posts = action.payload;
        }
    }
});

export default postSlice.reducer;

export function SetPost(post) {
    return (dispatch, getState) => {
        dispatch(postSlice.actions.getPost(post));
    };
}