package htmp.codien.quanlycodien.service.impl;

import htmp.codien.quanlycodien.dto.DailyWorkReportDTO;
import htmp.codien.quanlycodien.model.DailyWorkReport;
import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.repository.DailyWorkReportRepository;
import htmp.codien.quanlycodien.repository.EmployeeRepository;
import htmp.codien.quanlycodien.service.DailyWorkReportService;
import htmp.codien.quanlycodien.service.FileStorageService;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DailyWorkReportServiceImpl implements DailyWorkReportService {

    private final DailyWorkReportRepository reportRepository;
    private final EmployeeRepository employeeRepository;
    private final FileStorageService fileStorageService;

    @Override
    public List<DailyWorkReportDTO> getAllReports() {
        return reportRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private DailyWorkReportDTO toDTO(DailyWorkReport report) {
        Employee emp = report.getEmployee();
        return DailyWorkReportDTO.builder()
                .id(report.getId())
                .reportDate(report.getReportDate())
                .taskDescription(report.getTaskDescription())
                .startTime(report.getStartTime())
                .endTime(report.getEndTime())
                .filePath(report.getFilePath())
                .employeeId(emp != null ? emp.getId() : null)
                .employeeCode(emp != null ? emp.getCode() : null)
                .employeeName(emp != null ? emp.getName() : null)
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }

    @Override
    public List<DailyWorkReportDTO> getReportsByDate(LocalDate date) {
        return reportRepository.findByReportDate(date)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DailyWorkReportDTO> getReportsByEmployeeIdAndDate(Long employeeId, LocalDate date) {
        return reportRepository.findByEmployeeIdAndReportDate(employeeId, date)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void createReport(Long employeeId, LocalDate reportDate, LocalTime startTime, LocalTime endTime,
            String taskDescription, MultipartFile file) {
        try {
            String fileName = null;
            if (file != null && !file.isEmpty()) {
                fileName = fileStorageService.storeFile(file);
            }

            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại"));

            DailyWorkReport report = new DailyWorkReport();
            report.setEmployee(employee);
            report.setReportDate(reportDate);
            report.setStartTime(startTime);
            report.setEndTime(endTime);
            report.setTaskDescription(taskDescription);
            report.setFilePath(fileName);

            reportRepository.save(report);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lưu báo cáo", e);
        }
    }

    @Override
    public void updateReport(Long id, String employeeId, String reportDate, String startTime, String endTime,
            String taskDescription, MultipartFile file) {
        DailyWorkReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy báo cáo với id: " + id));

        Employee employee = employeeRepository.findById(Long.parseLong(employeeId))
                .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại với id: " + employeeId));
        report.setEmployee(employee);
        report.setReportDate(LocalDate.parse(reportDate));
        report.setStartTime(LocalTime.parse(startTime));
        report.setEndTime(LocalTime.parse(endTime));
        report.setTaskDescription(taskDescription);

        if (file != null && !file.isEmpty()) {
            // 🗑️ Xóa file cũ
            if (report.getFilePath() != null && !report.getFilePath().isBlank()) {
                fileStorageService.deleteFile(report.getFilePath());
            }

            // 📥 Lưu file mới
            String newFilePath;
            try {
                newFilePath = fileStorageService.storeFile(file);
                report.setFilePath(newFilePath);
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }

        }

        reportRepository.save(report);
    }

}
