// apis/axiosInstance.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Server from '../Constant/server';

const axiosInstance = axios.create({
  baseURL: Server,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
  },
});

// 🔹 Request Interceptor → Attach Token
axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('refreshToken'); // 👈 saved at login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// 🔹 Response Interceptor → Handle 401 or Refresh Flow
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      console.error('Unauthorized! Token may be expired.');
      // Optionally: refresh token logic here
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
