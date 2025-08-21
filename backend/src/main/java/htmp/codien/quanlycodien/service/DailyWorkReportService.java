package htmp.codien.quanlycodien.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import htmp.codien.quanlycodien.dto.dailyTask.DailyWorkReportDTO;
import htmp.codien.quanlycodien.dto.dailyTask.EmployeeWorkReportDTO;

public interface DailyWorkReportService {
        List<DailyWorkReportDTO> getAllReports();

        List<EmployeeWorkReportDTO> getReportsByDate(LocalDate date);

        List<EmployeeWorkReportDTO> getReportsByEmployeeIdAndDate(Long employeeId, LocalDate date);

        void createReport(Long employeeId, LocalDate reportDate, LocalTime startTime, LocalTime endTime,
                        String taskDescription, MultipartFile file);

        void updateReport(Long id, String employeeId, String reportDate, String startTime, String endTime,
                        String taskDescription, MultipartFile file);

        void deleteReport(Long id);

}
