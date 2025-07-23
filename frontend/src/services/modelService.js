import fileDownload from "js-file-download";
import axiosClient from "~/utils/axiosClient";

const API_URL = '/models';

class ModelService {
    // Lấy toàn bộ model
    async getAllModel() {
        try {
            const response = await axiosClient.get(API_URL);
            return response.data.data;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi không xác định khi lấy model mới';
            throw new Error(errorMessage);
        }
    }

    // Tìm kiếm model theo mã sản phẩm hoặc mã khuôn
    async searchByProductCodeOrMoldCode(keyword) {
        try {
            const response = await axiosClient.get(`${API_URL}/search`, {
                params: { keyword },
            });
            return response.data.data;
        } catch (error) {
            const errorMessage =    
                error?.response?.data?.message || error.message || 'Lỗi không xác định khi tìm kiếm model';
            throw new Error(errorMessage);
        }
    }

    // Lấy toàn bộ sản phẩm của model
    async getProductByModelId(modelId) {
        try {
            const response = await axiosClient.get(`${API_URL}/${modelId}`);
            return response.data.data;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi không xác định khi lấy danh sách sản phẩm trong đơn hàng';
            throw new Error(errorMessage);
        }
    }

    async createNewModel(formData) {
        try {
            const response = await axiosClient.post(`${API_URL}/create-from-excel`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.message;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi không xác định khi tạo đơn hàng';
            throw new Error(errorMessage);
        }
    }

    async downloadTemplate() {
        try {
            const response = await axiosClient.get(`${API_URL}/template`, {
                responseType: "blob", // để nhận file nhị phân
            });

            // Gợi ý tên file dựa theo header hoặc mặc định
            const contentDisposition = response.headers["content-disposition"];
            const fileNameMatch = contentDisposition?.match(/filename="?(.+)"?/);
            const fileName = fileNameMatch ? fileNameMatch[1] : "new-model-template.xlsx";

            fileDownload(response.data, fileName);
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || "Lỗi khi tải file mẫu";
            throw new Error(errorMessage);
        }
    }

    // Xóa model
    async deleteModel(modelId) {
        try {
            const response = await axiosClient.delete(`${API_URL}/${modelId}`);
            return response.data.message;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi không xác định khi xóa model';
            throw new Error(errorMessage);
        }
    }
}

export default new ModelService();