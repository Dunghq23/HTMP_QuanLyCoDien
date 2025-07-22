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

}

export default new ProductService;