import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";

type ThemeType = "light" | "dark";

interface ThemeState {
    theme: ThemeType;
}

const getInitialTheme = (): ThemeType => {
    try {
        const item = window.localStorage.getItem("theme");
        return item ? JSON.parse(item) : "light";
    } catch {
        return "light";
    }
}

const initialState: ThemeState = {
    theme: getInitialTheme(),
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<ThemeType>) => {
            state.theme = action.payload;
            window.localStorage.setItem("theme", JSON.stringify(action.payload));
        }
    }
});

export default themeSlice.reducer;

export function SetTheme(value: ThemeType) {
    return (dispatch: AppDispatch) => {
        dispatch(themeSlice.actions.setTheme(value));
    };
} 
