import axiosClient from '~/utils/axiosClient';

const API_URL = '/daily-reports';

const dailyWorkReportService = {
    getAll: async () => {
        try {
            const response = await axiosClient.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi fetch:", error);
            return [];
        }
    },

    getByDate: async (date) => {
        try {
            const response = await axiosClient.get(`${API_URL}`, {
                params: { date } // sử dụng query parameter
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi fetch theo ngày:", error);
            return [];
        }
    },

    getByEmployeeAndDate: async (employeeId, date) => {
        try {
            const response = await axiosClient.get(`${API_URL}`, {
                params: { employeeId, date } // sử dụng query parameter
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi fetch theo nhân viên và ngày:", error);
            return [];
        }
    },

    // Ví dụ thêm: tạo mới báo cáo
    create: async (payload) => {
        const formData = new FormData();

        // Đúng key tên "file" khớp backend
        if (payload.file) {
            formData.append("file", payload.file);
        }

        formData.append("employeeId", payload.employeeId);
        formData.append("reportDate", payload.reportDate);
        formData.append("startTime", payload.startTime);
        formData.append("endTime", payload.endTime);
        formData.append("taskDescription", payload.taskDescription);

        const response = await axiosClient.post(API_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.message;
    },

    // Ví dụ thêm: cập nhật báo cáo
    update: async (id, payload) => {
        const formData = new FormData();
        if (payload.file) {
            formData.append("file", payload.file);
        }

        formData.append("employeeId", payload.employeeId);
        formData.append("reportDate", payload.reportDate);
        formData.append("startTime", payload.startTime);
        formData.append("endTime", payload.endTime);
        formData.append("taskDescription", payload.taskDescription);

        const response = await axiosClient.put(`${API_URL}/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.message;
    },

    // Ví dụ thêm: xóa báo cáo
    remove: (id) => {
        return axiosClient.delete(`${API_URL}/${id}`);
    }
};

export default dailyWorkReportService;
