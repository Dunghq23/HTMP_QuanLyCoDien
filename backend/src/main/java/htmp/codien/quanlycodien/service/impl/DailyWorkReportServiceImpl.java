package htmp.codien.quanlycodien.service.impl;

import htmp.codien.quanlycodien.dto.dailyTask.DailyWorkReportDTO;
import htmp.codien.quanlycodien.dto.dailyTask.DailyWorkReportItemDTO;
import htmp.codien.quanlycodien.dto.dailyTask.EmployeeWorkReportDTO;
import htmp.codien.quanlycodien.exception.ResourceNotFoundException;
import htmp.codien.quanlycodien.model.DailyWorkReport;
import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.repository.DailyWorkReportRepository;
import htmp.codien.quanlycodien.repository.EmployeeRepository;
import htmp.codien.quanlycodien.repository.WorkScheduleRepository;
import htmp.codien.quanlycodien.service.DailyWorkReportService;
import htmp.codien.quanlycodien.service.FileStorageService;
import htmp.codien.quanlycodien.utils.SecurityUtils;
import htmp.codien.quanlycodien.utils.WorkTimeCalculator;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DailyWorkReportServiceImpl implements DailyWorkReportService {

    private final DailyWorkReportRepository reportRepository;
    private final EmployeeRepository employeeRepository;
    private final FileStorageService fileStorageService;
    private final WorkScheduleRepository workScheduleRepository;

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
                .build();
    }

    private DailyWorkReportItemDTO toItemDTO(DailyWorkReport report) {
        return DailyWorkReportItemDTO.builder()
                .id(report.getId())
                .reportDate(report.getReportDate())
                .taskDescription(report.getTaskDescription())
                .startTime(report.getStartTime())
                .endTime(report.getEndTime())
                .filePath(report.getFilePath())
                .build();
    }

    @Override
    public List<EmployeeWorkReportDTO> getReportsByDate(LocalDate date) {

        Long employeeId = SecurityUtils.getCurrentEmployeeId();
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên không tồn tại"));

        List<DailyWorkReport> reports;
        if ("ROLE_MANAGER".equals(employee.getRole())) {
            reports = reportRepository.findReportsByDepartmentAndDate(employee.getDepartment().getId(), date);
        } else {
            reports = reportRepository.findByReportDate(date);
        }

        // Map Employee -> List<DailyWorkReportItemDTO>
        Map<Employee, List<DailyWorkReportItemDTO>> employeeReportMap = new HashMap<>();
        for (DailyWorkReport report : reports) {
            Employee emp = report.getEmployee();
            if (emp == null)
                continue;

            DailyWorkReportItemDTO itemDTO = toItemDTO(report);
            employeeReportMap.computeIfAbsent(emp, k -> new ArrayList<>()).add(itemDTO);
        }

        List<EmployeeWorkReportDTO> result = new ArrayList<>();

        for (Map.Entry<Employee, List<DailyWorkReportItemDTO>> entry : employeeReportMap.entrySet()) {
            Employee emp = entry.getKey();
            List<DailyWorkReportItemDTO> items = entry.getValue();

            // Xác định thời gian bắt đầu và kết thúc thực tế
            LocalTime startTime = null;
            LocalTime endTime = null;
            for (DailyWorkReportItemDTO item : items) {
                if (item.getStartTime() != null && (startTime == null || item.getStartTime().isBefore(startTime))) {
                    startTime = item.getStartTime();
                }
                if (item.getEndTime() != null && (endTime == null || item.getEndTime().isAfter(endTime))) {
                    endTime = item.getEndTime();
                }
            }

            // Lấy giờ ca từ WorkSchedule
            LocalTime shiftStart = null;
            LocalTime shiftEnd = null;
            List<Object[]> shiftTimes = workScheduleRepository.findShiftTimesByEmployeeAndDate(
                    emp.getId(),
                    items.get(0).getReportDate());

            if (!shiftTimes.isEmpty()) {
                Object[] shiftTimeEmployee = shiftTimes.get(0);
                shiftStart = shiftTimeEmployee[0] != null ? ((java.sql.Time) shiftTimeEmployee[0]).toLocalTime() : null;
                shiftEnd = shiftTimeEmployee[1] != null ? ((java.sql.Time) shiftTimeEmployee[1]).toLocalTime() : null;
            }

            // Nếu shift null thì dùng thời gian thực tế, còn nếu kết thúc công việc muộn
            // hơn shiftEnd thì lấy giờ kết thúc công việc
            LocalTime plannedStart = shiftStart != null ? shiftStart : startTime;

            // Nếu shiftEnd có và kết thúc công việc muộn hơn shiftEnd thì gán bằng kết thúc
            // công việc cuối cùng
            LocalTime plannedEnd;
            if (shiftEnd != null) {
                plannedEnd = endTime != null && endTime.isAfter(shiftEnd) ? endTime : shiftEnd;
            } else {
                plannedEnd = endTime;
            }

            // Tổng phút theo ca
            long plannedMinutes = plannedStart != null && plannedEnd != null
                    ? java.time.Duration.between(plannedStart, plannedEnd).toMinutes()
                    : 0;

            // Tổng phút thực tế từ các công việc
            long actualMinutes = WorkTimeCalculator.calculateTotalMinutes(
                    items,
                    DailyWorkReportItemDTO::getStartTime,
                    DailyWorkReportItemDTO::getEndTime);

            // Hiệu suất làm việc (%)
            double efficiency = plannedMinutes > 0 ? (double) actualMinutes / plannedMinutes * 100 : 0;

            EmployeeWorkReportDTO empDTO = EmployeeWorkReportDTO.builder()
                    .employeeId(emp.getId())
                    .employeeCode(emp.getCode())
                    .employeeName(emp.getName())
                    .startTime(startTime)
                    .endTime(endTime)
                    .workEfficiency(efficiency)
                    .departmentName(emp.getDepartment() != null ? emp.getDepartment().getName() : null)
                    .positionName(emp.getPosition() != null ? emp.getPosition().getName() : null)
                    .reports(items)
                    .build();

            result.add(empDTO);
        }

        return result;
    }

    @Override
    public List<EmployeeWorkReportDTO> getReportsByEmployeeIdAndDate(Long employeeId, LocalDate date) {
        List<DailyWorkReport> reports = reportRepository.findByEmployeeIdAndReportDate(employeeId, date);

        return reports.stream()
                .collect(Collectors.groupingBy(DailyWorkReport::getEmployee)) // group theo employee
                .entrySet()
                .stream()
                .map(entry -> {
                    Employee emp = entry.getKey();
                    List<DailyWorkReportItemDTO> items = entry.getValue()
                            .stream()
                            .map(this::toItemDTO)
                            .collect(Collectors.toList());

                    return EmployeeWorkReportDTO.builder()
                            .employeeId(emp.getId())
                            .employeeName(emp.getName())
                            .departmentName(emp.getDepartment() != null ? emp.getDepartment().getName() : null)
                            .positionName(emp.getPosition() != null ? emp.getPosition().getName() : null)
                            .reports(items)
                            .build();
                })
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
                e.printStackTrace();
            }

        }
        reportRepository.save(report);
    }

    @Override
    public void deleteReport(Long id) {
        DailyWorkReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy báo cáo với id: " + id));
        if (report.getFilePath() != null && !report.getFilePath().isBlank()) {
            fileStorageService.deleteFile(report.getFilePath());
        }
        reportRepository.delete(report);
    }
}
