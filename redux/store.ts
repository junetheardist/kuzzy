import {configureStore} from '@reduxjs/toolkit';
import vendorReducer from './vendorSlice';
import stepReducer from './stepSlice';
import authReducer from './authSlice';
import locationReducer from "./location/locationSlice";

export const store = configureStore({
    reducer: {
        vendor: vendorReducer,
        step: stepReducer,
        auth: authReducer,
        location: locationReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
