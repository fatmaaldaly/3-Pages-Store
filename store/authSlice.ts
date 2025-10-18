import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
  user: any | null;
  accessToken: string | null;
  isSuperAdmin?: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isSuperAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isSuperAdmin = action.payload?.username === 'emilys';
      
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setUser, setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
