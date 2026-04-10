import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducer';
import { apiSlice } from './apiSlice';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const { dispatch } = store;

export { dispatch, store };
