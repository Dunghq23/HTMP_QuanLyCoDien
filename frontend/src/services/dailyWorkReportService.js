import axiosClient from '~/utils/axiosClient';

const API_URL = '/daily-reports';

const dailyWorkReportService = {
    getAll: async () => {
        try {
            const response = await axiosClient.get(API_URL);
            console.log(response.data); // ✅ Lúc này mới có dữ liệu
            return response.data;
        } catch (error) {
            console.error("Lỗi khi fetch:", error);
            return [];
        }
    },

    // Ví dụ thêm: tạo mới báo cáo
    create: (data) => {
        return axiosClient.post(API_URL, data);
    },

    // Ví dụ thêm: cập nhật báo cáo
    update: (id, data) => {
        return axiosClient.put(`${API_URL}/${id}`, data);
    },

    // Ví dụ thêm: xóa báo cáo
    remove: (id) => {
        return axiosClient.delete(`${API_URL}/${id}`);
    }
};

export default dailyWorkReportService;
