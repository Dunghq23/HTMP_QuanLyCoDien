import axios from 'axios';
import authService from '~/services/authService';

// Base config
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  withCredentials: true, // nếu dùng cookie cho auth
});

// Add interceptors
axiosClient.interceptors.request.use(
  (config) => {
    // Ví dụ: gắn token nếu có
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi 401, 403, 500, ...
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn('Chưa đăng nhập hoặc token hết hạn');
        authService.logout();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (status === 403) {
        console.warn('Không có quyền truy cập');
        authService.logout(); // Đăng xuất nếu cần
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
