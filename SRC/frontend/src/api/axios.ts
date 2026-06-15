import axios from 'axios';

// Axios instance using Vite proxy base url '/api'
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup response interceptors for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error message
    const message = error.response?.data?.message || 'Đã xảy ra lỗi kết nối với máy chủ!';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
