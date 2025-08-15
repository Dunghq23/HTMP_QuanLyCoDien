import axiosClient from "~/utils/axiosClient";

const API_URL = '/employees';

export const getAllEmployees = async () => {
  const res = await axiosClient.get(API_URL);
  return res.data.data;
};

export const createEmployee = async (employeeData) => {
  const res = await axiosClient.post(API_URL, employeeData);
  return res.data.data;
};

export const updateEmployee = async (id, employeeData) => {
  const res = await axiosClient.patch(`${API_URL}/${id}`, employeeData);
  return res.data.data;
};


class EmployeeService {
  async getAllEmployees() {
    const res = await axiosClient.get(API_URL);
    return res.data.data;
  }

  async createEmployee(data) {
    try {
      const response = await axiosClient.post(`${API_URL}`, data);
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Lỗi không xác định";
      throw new Error(errorMessage);
    }
  }

  async getEmployeeById(employeeId) {
    try {
      const response = await axiosClient.get(`${API_URL}/${employeeId}`);
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Lỗi không xác định';
      throw new Error(errorMessage);
    }
  }

  async getEmployeesByDepartment(departmentId) {
    try {
      const response = await axiosClient.get(`${API_URL}/department/${departmentId}`);
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Lỗi không xác định';
      throw new Error(errorMessage);
    }
  }

  async updateEmployee(employeeId, data) {
    try {
      const response = await axiosClient.patch(`${API_URL}/${employeeId}`, data);
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Lỗi không xác định";
      throw new Error(errorMessage);
    }
  }

  async deleteEmployee(employeeId) {
    try {
      const response = await axiosClient.delete(`${API_URL}/${employeeId}`);
      return response.data.message;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Lỗi không xác định";
      throw new Error(errorMessage);
    }
  }

}

export default new EmployeeService();