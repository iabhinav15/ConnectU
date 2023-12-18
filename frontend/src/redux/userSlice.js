import {createSlice} from '@reduxjs/toolkit';
// import {user} from '../assets/data';
const initialState = {
    user: JSON.parse(window?.localStorage.getItem("user")) ?? {},
    edit: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
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
    }
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