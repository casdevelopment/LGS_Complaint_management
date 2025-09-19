// apis/configuration.js
import axios from 'axios';
import Server from '../Constant/server';
import axiosInstance from '../utils/axiosInstance';

const historyEndpoints = {
  parent: '/api/complaint/complaint-list',
  employee: '/api/oic/complaint-list',
  oic: '/api/oic/complaint-list',
};
const complainSummaryEndpoints = {
  parent: '/api/complaint/complaint-summary',
  employee: '/api/oic/complaint-summary',
  oic: '/api/oic/complaint-summary',
};

export const getAllCampus = async () => {
  console.log();
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
export const resendOTP = async payload => {
  try {
    const response = await axios.post(
      `${Server}/api/auth/resend-otp`, // 👈 use correct endpoint
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
    console.error('Resend OTP error:', error.response?.data || error.message);
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
// 🔹 Update Profile
export const updateProfile = async payload => {
  try {
    const response = await axiosInstance.post(
      '/api/profile/update-profile',
      payload,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Update Profile error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const updateProfilePic = async payload => {
  try {
    const response = await axiosInstance.post(
      '/api/profile/update-profile-picture',
      payload,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Update Profile error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 🔹 Update Password
export const updatePassword = async payload => {
  try {
    const response = await axiosInstance.post(
      '/api/profile/profile-password',
      payload,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Update Password error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const getConplainCategories = async () => {
  try {
    const response = await axiosInstance.post(
      '/api/configuration/get-complaint-category',
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
export const getNotificationCount = async payload => {
  try {
    const response = await axiosInstance.post(
      '/api/notifications/unread-notification',
      payload,
    );
    return response?.data;
  } catch (error) {
    console.log(
      'Error fetching notification count :',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const deleteNotification = async payload => {
  try {
    const response = await axiosInstance.post(
      '/api/notifications/delete-notification',
      payload,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Error delete notification :',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const getNotifications = async payload => {
  try {
    const response = await axiosInstance.post(
      '/api/notifications/notification-list',
      payload,
    );
    console.log(response?.data);
    return response?.data;
  } catch (error) {
    console.error(
      'Error fetching notifications lists:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const getConplainTypes = async () => {
  try {
    const response = await axiosInstance.post(
      '/api/configuration/get-complaint-type',
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
export const launchComplaint = async formData => {
  try {
    const response = await axiosInstance.post(
      `${Server}/api/complaint/launch-complaint`, // 🔹 replace with your actual endpoint
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error launching complaint:', error.response?.data || error);
    throw error;
  }
};

export const complainDashboard = async payload => {
  try {
    const response = await axiosInstance.post(
      '/api/complaint/complaint-dashboard',
      payload,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Complain Dashboard error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const oicDashboard = async payload => {
  try {
    const response = await axiosInstance.post(
      '/api/oic/oic-dashboard',
      payload,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Complain Dashboard error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const getDepartments = async payload => {
  try {
    const response = await axiosInstance.post(
      '/api/oic/get-departments',
      payload,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Get department error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const getDepatmentEmployees = async payload => {
  try {
    const response = await axiosInstance.post(
      '/api/oic/get-department-employees',
      payload,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Get department employee error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const forwardComplaint = async payload => {
  try {
    const response = await axiosInstance.post('/api/oic/assign-agent', payload);
    return response?.data;
  } catch (error) {
    console.error(
      'Forward complain error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const dropComplaint = async payload => {
  try {
    const response = await axiosInstance.post(
      '/api/oic/drop-complaint',
      payload,
    );
    return response?.data;
  } catch (error) {
    console.error(
      'Drop complain error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const closeComplaint = async payload => {
  try {
    const response = await axiosInstance.post('/api/oic/agent-submit', payload);
    return response?.data;
  } catch (error) {
    console.error('Agent submit error:', error.response?.data || error.message);
    throw error;
  }
};
export const parentReview = async payload => {
  try {
    const response = await axiosInstance.post(
      '/api/complaint/complaint-rating',
      payload,
    );
    return response?.data;
  } catch (error) {
    console.error('Agent submit error:', error.response?.data || error.message);
    throw error;
  }
};

// export const complainHistory = async payload => {
//   try {
//     const response = await axiosInstance.post(
//       '/api/complaint/complaint-list',
//       payload,
//     );
//     return response?.data;
//   } catch (error) {
//     console.error(
//       'Complain History error:',
//       error.response?.data || error.message,
//     );
//     throw error;
//   }
// };
export const complainHistory = async (payload, role) => {
  console.log(payload, 'nnn');
  try {
    const url = historyEndpoints[role];
    if (!url) throw new Error(`No endpoint defined for role: ${role}`);

    const response = await axiosInstance.post(url, payload);
    return response?.data;
  } catch (error) {
    console.error(
      'Complain History error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const attendedComplaints = async (payload, role) => {
  console.log(payload, 'nnn');
  try {
    const url = historyEndpoints[role];
    if (!url) throw new Error(`No endpoint defined for role: ${role}`);

    const response = await axiosInstance.post(url, payload);
    return response?.data;
  } catch (error) {
    console.error(
      'Complain History error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const complainHistorySummary = async (payload, role) => {
  try {
    const url = complainSummaryEndpoints[role];
    if (!url) throw new Error(`No endpoint defined for role: ${role}`);

    const response = await axiosInstance.post(url, payload);
    // const response = await axiosInstance.post(
    //   '/api/complaint/complaint-summary',
    //   payload,
    // );
    return response?.data;
  } catch (error) {
    console.error(
      'Complain History summary error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
