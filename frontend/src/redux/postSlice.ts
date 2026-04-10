import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";

interface PostState {
    posts: any; // using any for now, refine later
}

const initialState: PostState = {
    posts: {},
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        getPosts: (state, action: PayloadAction<any>) => {
            state.posts = action.payload;
        }
    }
});

export default postSlice.reducer;

export function SetPosts(post: any) {
    return (dispatch: AppDispatch) => {
        dispatch(postSlice.actions.getPosts(post));
    };
}
