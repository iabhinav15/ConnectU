import {createAsyncThunk, createSlice, current} from '@reduxjs/toolkit';
// import {user} from '../assets/data';
const initialState = {
    user: JSON.parse(window?.localStorage.getItem("user")) ?? {},
    edit: false,
};

/* For api call in redux.
// First, create the thunk
// https://redux-toolkit.js.org/api/createAsyncThunk
const apiData = createAsyncThunk("anyData", async (anime) => {
    const response = await fetch(`https://api.example.com/v3/search/anime?q=${anime}`);
    const json = await response.json();
    return json;
});
*/

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
            /* 
            console.log(state.user); //will not print
            console.log(current(state.user)); //will print because current takes a snapshot of the state
            */
        },
        logout: (state) => {
            state.user = null;
            localStorage?.removeItem("user");
        },
        updateProfile: (state, action) => {
            state.edit = action.payload;
        },
        addFriend: (state, action) => {
            state.user.friends.push(action.payload);
        },
        removeFriend: (state, action) => {
            state.user.friends = state.user.friends.filter(friend => friend._id !== action.payload._id);
        }        
    },
   /* extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchUserById.fulfilled, (state, action) => {
          // Add user to the state array 'entities'
          state.entities.push(action.payload)
        })
    }*/
});

export default userSlice.reducer;

export function UserLogin(user) {
    return (dispatch, getState) => {
        dispatch(userSlice.actions.login(user));
    };
}

export function Logout() {
    return (dispatch, getState) => {
        dispatch(userSlice.actions.logout());
    };
}

export function UpdateProfile(edit) {
    return (dispatch, getState) => {
        dispatch(userSlice.actions.updateProfile(edit));
    };
}

export function AddFriend(user) {
    return (dispatch, getState) => {
        dispatch(userSlice.actions.addFriend(user));
    }
}

export function RemoveFriend(user) {
    return (dispatch, getState) => {
        dispatch(userSlice.actions.removeFriend(user));
    }
}