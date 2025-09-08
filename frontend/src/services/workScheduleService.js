import axiosClient from "~/utils/axiosClient";

const API_URL = '/work-schedules';

class WorkScheduleService {

    // Lấy lịch làm việc theo phòng ban
    async getWorkScheduleByDepartment(departmentId, month, year) {
        try {
            const response = await axiosClient.get(`${API_URL}/department/${departmentId}`, {
                params: { month, year }
            });
            return response.data.data;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi không xác định';
            throw new Error(errorMessage);
        }
    }

    async getWorkScheduleByEmployee(employeeId, month, year) {
        try {
            const response = await axiosClient.get(`${API_URL}/employee/${employeeId}`, {
                params: { month, year }
            });
            return response.data.data;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi không xác định';
            throw new Error(errorMessage);
        }
    }

    async saveSchedulesOnce(data) {
        try {
            const response = await axiosClient.post(`${API_URL}`, data);
            return response.data.data;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || "Lỗi không xác định";
            throw new Error(errorMessage);
        }
    }

    // Xuất Excel theo phòng ban
    async exportWorkSchedule(departmentId, year, month) {
        try {
            const response = await axiosClient.get(`${API_URL}/export`, {
                params: { departmentId, year, month },
                responseType: 'blob' // ⚡️ quan trọng: nhận file nhị phân
            });

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `schedule-dept-${departmentId}-${year}-${month}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || "Lỗi khi xuất Excel";
            throw new Error(errorMessage);
        }
    }
}

export default new WorkScheduleService();