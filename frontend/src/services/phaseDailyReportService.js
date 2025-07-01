import axiosClient from "~/utils/axiosClient";

const API_URL = "/phase-daily-reports";

class PhaseDailyReportService {
    // Gửi báo cáo tiến độ 1 phase trong 1 ngày
    async createReport(data) {
        try {
            const response = await axiosClient.post(API_URL, data);
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi lưu báo cáo tiến độ phase:", error);
            throw error;
        }
    }
}

export default new PhaseDailyReportService();
