// utils/gantt.js
import dayjs from 'dayjs';

export const mapToGanttTask = (report, index) => {
    const start = dayjs(`${report.reportDate} ${report.startTime}`).toDate();
    let end = dayjs(`${report.reportDate} ${report.endTime}`).toDate();

    // Nếu kết thúc là 00:00:00 thì chuyển sang ngày hôm sau
    if (report.endTime === '00:00:00') {
        end = dayjs(report.reportDate).add(1, 'day').startOf('day').toDate();
    }

    return {
        id: `${report.id}`,
        name: report.taskDescription || `Công việc ${index + 1}`,
        start,
        end,
        type: 'task',
        progress: 100,
        project: report.employeeName,
        isDisabled: true,
        filePath: report.filePath,
    };
};