package htmp.codien.quanlycodien.service.impl;

import htmp.codien.quanlycodien.dto.dailyTask.DailyWorkReportDTO;
import htmp.codien.quanlycodien.dto.dailyTask.DailyWorkReportItemDTO;
import htmp.codien.quanlycodien.dto.dailyTask.EmployeeWorkReportDTO;
import htmp.codien.quanlycodien.exception.ResourceNotFoundException;
import htmp.codien.quanlycodien.model.DailyWorkReport;
import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.model.ShiftBreak;
import htmp.codien.quanlycodien.model.enums.Role;
import htmp.codien.quanlycodien.repository.DailyWorkReportRepository;
import htmp.codien.quanlycodien.repository.EmployeeRepository;
import htmp.codien.quanlycodien.repository.ShiftBreakRepository;
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
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DailyWorkReportServiceImpl implements DailyWorkReportService {

    private final DailyWorkReportRepository reportRepository;
    private final EmployeeRepository employeeRepository;
    private final FileStorageService fileStorageService;
    private final WorkScheduleRepository workScheduleRepository;
    private final ShiftBreakRepository shiftBreakRepository;

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

        List<Employee> employees;
        Role role = employee.getRole();
        if ("MANAGER".equals(role.name())) {
            employees = employeeRepository.findByDepartment_Id(employee.getDepartment().getId());
        } else if ("ADMIN".equals(role.name())) {
            employees = employeeRepository.findAll();
        } else if ("HEAD".equals(role.name())) {
            employees = employeeRepository.findEmployeesInDepartmentAndSubDepartments(employee.getDepartment().getId());
        } else {
            employees = List.of(employee);
        }

        List<EmployeeWorkReportDTO> result = new ArrayList<>();

        for (Employee emp : employees) {
            List<Object[]> shiftTimes = workScheduleRepository.findShiftTimesByEmployeeAndDate(emp.getId(), date);
            LocalDate startDate = date;
            LocalDate endDate = date;
            LocalTime shiftStart = LocalTime.MIN;
            LocalTime shiftEnd = LocalTime.MAX;
            Long shiftId = 0L;
            String shiftCode = "";

            if (!shiftTimes.isEmpty()) {
                Object[] shift = shiftTimes.get(0);
                shiftStart = shift[0] != null ? ((java.sql.Time) shift[0]).toLocalTime() : LocalTime.MIN;
                shiftEnd = shift[1] != null ? ((java.sql.Time) shift[1]).toLocalTime() : LocalTime.MAX;
                shiftId = shift[2] != null ? (Long) shift[2] : 0;
                shiftCode = shift[3] != null ? ((String) shift[3]) : "";

                // Nếu ca đêm (kết thúc nhỏ hơn bắt đầu) → sang ngày hôm sau
                if (shiftEnd.isBefore(shiftStart)) {
                    endDate = date.plusDays(1);
                }

                // ✅ Đệm trước & sau 6 tiếng
                shiftStart = shiftStart.minusHours(6);
                if (shiftStart.isBefore(LocalTime.MIN)) {
                    shiftStart = LocalTime.MIN;
                }

                shiftEnd = shiftEnd.plusHours(6);
                if (shiftEnd.isAfter(LocalTime.MAX)) {
                    shiftEnd = LocalTime.MAX;
                }
            }

            List<ShiftBreak> shiftBreaks = shiftBreakRepository.findAllByShift_Id(shiftId);
            List<WorkTimeCalculator.Interval> breaks = shiftBreaks.stream()
                    .map(b -> new WorkTimeCalculator.Interval(b.getStartTime(), b.getEndTime()))
                    .toList();
            List<DailyWorkReport> reports;

            if (!shiftTimes.isEmpty()) {
                // ✅ Có lịch làm việc
                reports = reportRepository.findReportsByEmployeeAndTimeRange(
                        emp.getId(), startDate, shiftStart, endDate, shiftEnd);
            } else {
                // ❌ Không có lịch làm việc → lấy toàn bộ trong ngày
                reports = reportRepository.findByEmployeeIdAndReportDate(emp.getId(), date);
            }

            if (reports.isEmpty())
                continue;

            List<DailyWorkReportItemDTO> items = reports.stream()
                    .map(this::toItemDTO)
                    .toList();

            // ===================== FIX START/END TIME =====================
            LocalDateTime shiftStartDT = LocalDateTime.of(startDate, shiftStart);
            LocalDateTime shiftEndDT = LocalDateTime.of(endDate, shiftEnd);

            LocalDateTime startTimeDT = null;
            LocalDateTime endTimeDT = null;

            for (DailyWorkReportItemDTO item : items) {
                if (item.getStartTime() != null) {
                    LocalDateTime itemStart = LocalDateTime.of(item.getReportDate(), item.getStartTime());
                    if (!itemStart.isBefore(shiftStartDT) && !itemStart.isAfter(shiftEndDT)) {
                        if (startTimeDT == null || itemStart.isBefore(startTimeDT)) {
                            startTimeDT = itemStart;
                        }
                    }
                }

                if (item.getEndTime() != null) {
                    LocalDateTime itemEnd = LocalDateTime.of(item.getReportDate(), item.getEndTime());
                    // nếu endTime < startTime thì cộng thêm 1 ngày (qua ngày)
                    if (item.getStartTime() != null) {
                        LocalDateTime itemStart = LocalDateTime.of(item.getReportDate(), item.getStartTime());
                        if (itemEnd.isBefore(itemStart)) {
                            itemEnd = itemEnd.plusDays(1);
                        }
                    }
                    if (!itemEnd.isBefore(shiftStartDT) && !itemEnd.isAfter(shiftEndDT)) {
                        if (endTimeDT == null || itemEnd.isAfter(endTimeDT)) {
                            endTimeDT = itemEnd;
                        }
                    }
                }
            }

            LocalTime startTime = startTimeDT != null ? startTimeDT.toLocalTime() : null;
            LocalTime endTime = endTimeDT != null ? endTimeDT.toLocalTime() : null;
            // =============================================================

            if (!shiftTimes.isEmpty()) {
                Object[] shiftTimeEmployee = shiftTimes.get(0);
                shiftStart = shiftTimeEmployee[0] != null ? ((java.sql.Time) shiftTimeEmployee[0]).toLocalTime() : null;
                shiftEnd = shiftTimeEmployee[1] != null ? ((java.sql.Time) shiftTimeEmployee[1]).toLocalTime() : null;
            }

            // Nếu shift null thì dùng thời gian thực tế, còn nếu kết thúc công việc muộn
            // hơn shiftEnd thì lấy giờ kết thúc công việc
            LocalTime plannedStart = shiftStart != null ? shiftStart : startTime;
            LocalTime plannedEnd = shiftEnd;

            Set<String> excludedShiftCodes = Set.of("KD", "KD150", "KD200", "C3");

            if (!excludedShiftCodes.contains(shiftCode)) {
                if (shiftEnd != null) {
                    plannedEnd = (endTime != null && endTime.isAfter(shiftEnd)) ? endTime : shiftEnd;
                }
            }

            // Tổng phút theo ca
            long plannedMinutes = Math.abs(plannedStart != null && plannedEnd != null
                    ? java.time.Duration.between(plannedStart, plannedEnd).toMinutes()
                    : 0);

            // Tổng phút nghỉ
            int totalShiftBreakMinutes = shiftBreaks.stream()
                    .mapToInt(ShiftBreak::getDuration)
                    .sum();

            // Tổng phút thực tế từ các công việc
            long actualMinutes = WorkTimeCalculator.calculateTotalMinutes(
                    items,
                    DailyWorkReportItemDTO::getStartTime,
                    DailyWorkReportItemDTO::getEndTime,
                    breaks);

            // Hiệu suất làm việc (%)
            double efficiency = plannedMinutes > 0 ? (double) actualMinutes /
                    (plannedMinutes - totalShiftBreakMinutes) * 100 : 0;

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
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên không tồn tại"));

        // Lấy ca làm việc của nhân viên
        List<Object[]> shiftTimes = workScheduleRepository.findShiftTimesByEmployeeAndDate(employeeId, date);

        List<DailyWorkReport> reports;
        if (!shiftTimes.isEmpty()) {
            Object[] shift = shiftTimes.get(0);
            LocalTime shiftStart = shift[0] != null ? ((java.sql.Time) shift[0]).toLocalTime() : LocalTime.MIN;
            LocalTime shiftEnd = shift[1] != null ? ((java.sql.Time) shift[1]).toLocalTime() : LocalTime.MAX;

            LocalDate startDate = date;
            LocalDate endDate = date;

            if (shiftEnd.isBefore(shiftStart)) {
                endDate = date.plusDays(1); // ca đêm
            }

            reports = reportRepository.findReportsByEmployeeAndTimeRange(
                    employeeId, startDate, shiftStart, endDate, shiftEnd);
        } else {
            // fallback: lấy trong ngày
            reports = reportRepository.findByEmployeeIdAndReportDate(employeeId, date);
        }

        List<DailyWorkReportItemDTO> items = reports.stream()
                .map(this::toItemDTO)
                .collect(Collectors.toList());

        return List.of(EmployeeWorkReportDTO.builder()
                .employeeId(employee.getId())
                .employeeName(employee.getName())
                .departmentName(employee.getDepartment() != null ? employee.getDepartment().getName() : null)
                .positionName(employee.getPosition() != null ? employee.getPosition().getName() : null)
                .reports(items)
                .build());
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
