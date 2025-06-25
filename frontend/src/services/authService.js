// src/services/authService.js

import axiosClient from "~/utils/axiosClient";

class AuthService {
  // Đăng nhập
  async login(code, password) {
    try {
      const response = await axiosClient.post("/auth/login", { code, password });
      const token = response.data.data.token;
      const employee = response.data.data.employee;

      localStorage.setItem("accessToken", token);
      localStorage.setItem("employeeId", employee.id);
      localStorage.setItem("employeeName", employee.name);
      localStorage.setItem("role", employee.role);

      return response.data.data; 
    } catch (err) {
      const message =
        err?.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại.";
      throw new Error(message);
    }
  }

  // Đăng xuất
  logout() {
    localStorage.clear();
  }

  // Kiểm tra xem đã đăng nhập chưa
  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  }

  // Lấy token hiện tại
  getToken() {
    return localStorage.getItem("accessToken");
  }

  // (Tuỳ chọn) Lấy thông tin người dùng từ token (nếu là JWT)
  getUserInfo() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (error) {
      console.error("Invalid token");
      return null;
    }
  }
}

export default new AuthService();
