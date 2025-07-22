import fileDownload from "js-file-download";
import axiosClient from "~/utils/axiosClient";

const API_URL = '/processes';

class ProcessService {
    async createProcess(formData) {
        try {
            const response = await axiosClient.post(`${API_URL}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.message;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi không xác định khi tạo công đoạn';
            throw new Error(errorMessage);
        }
    }

    async fetchProcessByProductId(productId) {
        try {
            const response = await axiosClient.get(`${API_URL}`, {
                params: { productId }, // 👈 Truyền productId dưới dạng query param
            });
            return response.data.data;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi không xác định khi lấy danh sách công đoạn';
            throw new Error(errorMessage);
        }
    };

    async updateStage({ id, completionDate, description }) {
        try {
            const response = await axiosClient.patch(
                `${API_URL}/stages/${id}`,
                null, // không có request body
                {
                    params: {
                        date: completionDate ? completionDate.toISOString().split('T')[0] : null, // "yyyy-MM-dd"
                        description,
                    },
                }
            );
            return response.data.message;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi không xác định khi cập nhật công đoạn';
            throw new Error(errorMessage);
        }
    }

    async updateProcess({ id, cost }) {
        try {
            const response = await axiosClient.patch(
                `${API_URL}/${id}`,
                null, // không có request body
                {
                    params: { cost },
                }
            );
            return response.data.message;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi không xác định khi cập nhật công đoạn';
            throw new Error(errorMessage);
        }
    }

    async deleteProcess(id) {
        try {
            const response = await axiosClient.delete(`${API_URL}/${id}`);
            return response.data.message;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi không xác định khi xóa công đoạn';
            throw new Error(errorMessage);
        }
    }

}

export default new ProcessService;