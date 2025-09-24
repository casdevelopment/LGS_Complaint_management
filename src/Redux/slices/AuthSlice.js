import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    refreshToken: null,
    user: null,
    fcmToken: null, // ✅ added this line
    isAuthenticated: false,
    userStats: null,
    student: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      // state.isAuthenticated = true;
    },
    setStudent: (state, action) => {
      state.student = action.payload.student;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setUserStats: (state, action) => {
      state.userStats = action.payload.userStats;
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    logout: state => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.fcmToken = null;
      AsyncStorage.removeItem('accessToken');
      AsyncStorage.removeItem('refreshToken');
    },
    resetAuth: state => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.fcmToken = null;
      state.isAuthenticated = false;
      state.userStats = null;
      state.student = null;
    },
  },
});

export const {
  setCredentials,
  setAuthenticated,
  setFcmToken,
  setUserStats,
  setStudent,
  logout,
  resetAuth,
} = authSlice.actions;
export default authSlice.reducer;
