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
  const res = await axiosClient.put(`${API_URL}/${id}`, employeeData);
  return res.data.data;
};