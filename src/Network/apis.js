// apis/configuration.js
import axios from 'axios';
import Server from '../Constant/server';

export const getAllCampus = async () => {
  try {
    const response = await axios.post(
      `${Server}/api/configuration/get-campus-list`,
      {
        headers: {
          Accept: '*/*',
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Error fetching campus lists:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getAllClasses = async campusId => {
  console.log(campusId, 'campusId');
  try {
    const response = await axios.post(
      `${Server}/api/configuration/get-campus-class-list`,
      {
        SchoolId: campusId, // ✅ body payload
      },
      {
        headers: {
          Accept: '*/*',
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Error fetching class lists:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
// 🔹 Signup API
export const signupUser = async payload => {
  try {
    const response = await axios.post(
      `${Server}/api/auth/register`, // 👈 adjust endpoint
      payload,
      {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);
    throw error;
  }
};
export const loginUser = async payload => {
  try {
    const response = await axios.post(
      `${Server}/api/auth/login`, // 👈 adjust endpoint
      payload,
      {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};
export const forgotPassword = async payload => {
  try {
    const response = await axios.post(
      `${Server}/api/auth/forgot-password`, // 👈 adjust endpoint
      payload,
      {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Forgot Password error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
// ✅ Verify Signup OTP
export const verifySignupOTP = async payload => {
  try {
    const response = await axios.post(
      `${Server}/api/auth/verify-signup-otp`, // 👈 use correct endpoint
      payload,
      {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Signup OTP verification error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const verifyForgotOtp = async payload => {
  try {
    const response = await axios.post(
      `${Server}/api/auth/verify-otp`, // 👈 use correct endpoint
      payload,
      {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Signup OTP verification error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const resetPassword = async payload => {
  try {
    const response = await axios.post(
      `${Server}/api/auth/reset-password`, // 👈 adjust endpoint
      payload,
      {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Reset Password error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
