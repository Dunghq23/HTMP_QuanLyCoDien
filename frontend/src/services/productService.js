import fileDownload from "js-file-download";
import axiosClient from "~/utils/axiosClient";

const API_URL = '/products';

class ProductService {
    async uploadProductImage(productId, formData) {
        try {
            const response = await axiosClient.patch(`${API_URL}/${productId}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.message;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi không xác định khi tải lên ảnh sản phẩm';
            throw new Error(errorMessage);
        }
    }

    async submitHandover(formData) {
        try {
            const response = await axiosClient.post(
                `/products/handover`,
                formData,
                {
                    responseType: "blob",
                }
            );

            // Tạo URL từ Blob PDF
            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);

            return fileURL; // <-- Trả về URL
        } catch (error) {
            const msg = error?.response?.data?.message || error.message;
            throw new Error("Lỗi tạo biên bản: " + msg);
        }
    }

    async getProductStatuses() {
        try {
            const response = await axiosClient.get(`${API_URL}/statuses`);
            return response.data.data;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi không xác định khi tải lên ảnh sản phẩm';
            throw new Error(errorMessage);
        }
    }

    async getProductSummary(params = {}) {
        try {
            let url = `${API_URL}/summary`;

            const response = await axiosClient.get(url, { params });
            return response.data.data; // Trả về summary object
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi khi tải tổng hợp sản phẩm';
            throw new Error(errorMessage);
        }
    }

    async getQuantityProductByStagesIsBeingDone() {
        try {
            const response = await axiosClient.get(`${API_URL}/summary-being-done`);
            return response.data.data; // Trả về dữ liệu số lượng sản phẩm theo từng giai đoạn
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi khi lấy số lượng sản phẩm theo giai đoạn';
            throw new Error(errorMessage);
        }
    }

    async getProductTestSummaryByEmployee(startDate, endDate) {
        try {
            const response = await axiosClient.get(`${API_URL}/test-summary-by-employee`, {
                params: {
                    startDate,
                    endDate,
                },
            });
            return response.data.data; // Trả về dữ liệu tổng hợp thử nghiệm theo nhân viên
        }
        catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi khi lấy tổng hợp thử nghiệm theo nhân viên';
            throw new Error(errorMessage);
        }
    }

}

export default new ProductService;