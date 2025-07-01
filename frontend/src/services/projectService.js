import fileDownload from "js-file-download";
import axiosClient from "~/utils/axiosClient";

const API_URL = '/projects';

class ProjectService {
    // CREATE PROJECT
    async createProject(formData) {
        try {
            const response = await axiosClient.post(`${API_URL}`, formData);
            return response.data.message;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || 'Lỗi không xác định';
            throw new Error(errorMessage);
        }
    }

    // Lấy toàn bộ project
    async getAllProject() {
        try {
            const response = await axiosClient.get(`${API_URL}`);
            return response.data.data;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || 'Lỗi không xác định';
            throw new Error(errorMessage);
        }
    }

    async getDailyProgress(projectId, from, to) {
        try {
            const params = {};
            if (from) params.from = from;
            if (to) params.to = to;

            const response = await axiosClient.get(`${API_URL}/${projectId}/daily-progress`, {
                params: params
            });

            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy daily progress:", error);
            return null;
        }
    }

    async getSnapshot(projectId, date) {
        try {
            const response = await axiosClient.get(`${API_URL}/${projectId}/daily-progress-single`, {
                params: { date }
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy snapshot:", error);
            return null;
        }
    }



}

export default new ProjectService();