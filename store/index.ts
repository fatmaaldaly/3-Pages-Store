import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';


export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom Hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
