import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";

export interface UserType {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    location?: string;
    profession?: string;
    profileUrl?: string;
    friends: UserType[];
    views: string[];
    verified: boolean;
    token?: string;
}

interface UserState {
    user: UserType | null;
    edit: boolean;
}

const getInitialUser = (): UserType | null => {
    try {
        const item = window.localStorage.getItem("user");
        return item ? JSON.parse(item) : null;
    } catch {
        return null;
    }
};

const initialState: UserState = {
    user: getInitialUser(),
    edit: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserType>) => {
            state.user = action.payload;
            window.localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            window.localStorage.removeItem("user");
        },
        updateProfile: (state, action: PayloadAction<boolean>) => {
            state.edit = action.payload;
        },
        addFriend: (state, action: PayloadAction<UserType>) => {
            if (state.user) {
                state.user.friends.push(action.payload);
            }
        },
        removeFriend: (state, action: PayloadAction<UserType>) => {
            if (state.user) {
                state.user.friends = state.user.friends.filter(friend => friend._id !== action.payload._id);
            }
        }
    },
});

export default userSlice.reducer;

export function UserLogin(user: UserType) {
    return (dispatch: AppDispatch) => {
        dispatch(userSlice.actions.login(user));
    };
}

export function Logout() {
    return (dispatch: AppDispatch) => {
        dispatch(userSlice.actions.logout());
    };
}

export function UpdateProfile(edit: boolean) {
    return (dispatch: AppDispatch) => {
        dispatch(userSlice.actions.updateProfile(edit));
    };
}

export function AddFriend(user: UserType) {
    return (dispatch: AppDispatch) => {
        dispatch(userSlice.actions.addFriend(user));
    }
}

export function RemoveFriend(user: UserType) {
    return (dispatch: AppDispatch) => {
        dispatch(userSlice.actions.removeFriend(user));
    }
}
