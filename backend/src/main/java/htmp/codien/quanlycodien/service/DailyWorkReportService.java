package htmp.codien.quanlycodien.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import htmp.codien.quanlycodien.dto.DailyWorkReportDTO;

public interface DailyWorkReportService {
    List<DailyWorkReportDTO> getAllReports();

    List<DailyWorkReportDTO> getReportsByDate(LocalDate date);

    List<DailyWorkReportDTO> getReportsByEmployeeIdAndDate(Long employeeId, LocalDate date);

    void createReport(Long employeeId, LocalDate reportDate, LocalTime startTime, LocalTime endTime,
            String taskDescription, MultipartFile file);

    void updateReport(Long id, String employeeId, String reportDate, String startTime, String endTime,
            String taskDescription, MultipartFile file);

    
}
