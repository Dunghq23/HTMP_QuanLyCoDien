package htmp.codien.quanlycodien.service.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import htmp.codien.quanlycodien.dto.schedule.EmployeeScheduleRequest;
import htmp.codien.quanlycodien.dto.schedule.EmployeeScheduleResponse;
import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.model.WorkSchedule;
import htmp.codien.quanlycodien.repository.EmployeeRepository;
import htmp.codien.quanlycodien.repository.ShiftRepository;
import htmp.codien.quanlycodien.repository.WorkScheduleRepository;
import htmp.codien.quanlycodien.service.WorkScheduleService;
import htmp.codien.quanlycodien.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkScheduleServiceImpl implements WorkScheduleService {
    private final ShiftRepository shiftRepository;
    private final WorkScheduleRepository workScheduleRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public void saveSchedulesOnce(List<EmployeeScheduleRequest> requests) {
        Long currentDepartmentId = SecurityUtils.getCurrentDepartmentId();
        if (requests.isEmpty()) {
            throw new RuntimeException("Dữ liệu trống");
        }

        // Xác định tháng & năm từ bản ghi đầu tiên
        LocalDate firstDate = LocalDate.parse(requests.get(0).getDays().keySet().iterator().next());
        int year = firstDate.getYear();
        int month = firstDate.getMonthValue();

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        // ✅ Xoá lịch cũ chỉ của phòng ban hiện tại
        workScheduleRepository.deleteByWorkDateBetweenAndEmployee_Department_Id(start, end, currentDepartmentId);

        // Tạo lịch mới
        List<WorkSchedule> toSave = new ArrayList<>();
        for (EmployeeScheduleRequest req : requests) {
            Employee employee = employeeRepository.findById(req.getEmployeeId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

            for (var entry : req.getDays().entrySet()) {
                LocalDate date = LocalDate.parse(entry.getKey());
                Long shiftId = entry.getValue();

                if (shiftId == null)
                    continue;

                var shift = shiftRepository.findById(shiftId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy ca"));

                toSave.add(WorkSchedule.builder()
                        .employee(employee)
                        .shift(shift)
                        .workDate(date)
                        .isOvertime(false)
                        .status("ACTIVE")
                        .build());
            }
        }
        workScheduleRepository.saveAll(toSave);
    }

    @Override
    public List<EmployeeScheduleResponse> getWorkScheduleByDepartment(Long departmentId, String month, String year) {
        LocalDate startDate = LocalDate.of(Integer.parseInt(year), Integer.parseInt(month), 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Object[]> rawResults = workScheduleRepository
                .findWorkSchedulesByDepartmentAndDate(departmentId, startDate, endDate);

        Map<Long, EmployeeScheduleResponse> map = new LinkedHashMap<>();

        for (Object[] row : rawResults) {
            Long empId = ((Number) row[0]).longValue(); // e.id
            String empName = (String) row[1]; // e.name
            String empCode = (String) row[2]; // e.code
            String workDate = row[3].toString(); // ws.work_date
            String shiftCode = (String) row[5]; // s.shift_code (cột thứ 6)

            map.computeIfAbsent(empId, id -> EmployeeScheduleResponse.builder()
                    .employeeId(empId)
                    .employeeName(empName)
                    .employeeCode(empCode)
                    .days(new LinkedHashMap<>())
                    .build());

            map.get(empId).getDays().put(workDate, shiftCode);
        }

        return new ArrayList<>(map.values());
    }

    @Override
    public EmployeeScheduleResponse getWorkScheduleByEmployee(Long employeeId, String month, String year) {
        // Xác định ngày bắt đầu và kết thúc tháng
        LocalDate startDate = LocalDate.of(Integer.parseInt(year), Integer.parseInt(month), 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        // Lấy dữ liệu thô từ repository
        List<Object[]> rawResults = workScheduleRepository
                .findWorkSchedulesByEmployeeAndDate(employeeId, startDate, endDate);

        // Dùng LinkedHashMap để giữ thứ tự ngày
        Map<Long, EmployeeScheduleResponse> map = new LinkedHashMap<>();

        for (Object[] row : rawResults) {
            Long empId = ((Number) row[0]).longValue(); // e.id
            String empName = (String) row[1]; // e.name
            String empCode = (String) row[2]; // e.code
            LocalDate workDate = ((java.sql.Date) row[3]).toLocalDate(); // ws.work_date
            String shiftCode = (String) row[5]; // s.shift_code

            // Tạo response nếu chưa có
            map.computeIfAbsent(empId, id -> EmployeeScheduleResponse.builder()
                    .employeeId(empId)
                    .employeeName(empName)
                    .employeeCode(empCode)
                    .days(new LinkedHashMap<>())
                    .build());

            // Gán ca cho ngày
            map.get(empId).getDays().put(workDate.toString(), shiftCode);
        }

        // Nếu chỉ lấy cho 1 nhân viên, trả về kết quả đầu tiên (hoặc null nếu không có)
        return map.values().stream().findFirst().orElse(null);
    }

    @Override
    public ByteArrayInputStream exportWorkSchedule(Long departmentId, int year, int month) {
        List<EmployeeScheduleResponse> schedules = getWorkScheduleByDepartment(
                departmentId, String.valueOf(month), String.valueOf(year));

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Tháng " + month + " - " + year);

            // ======= Font & Style =======
            Font normalFont = workbook.createFont();
            normalFont.setFontName("Times New Roman");
            normalFont.setBold(false);

            Font boldFont = workbook.createFont();
            boldFont.setFontName("Times New Roman");
            boldFont.setBold(true);

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setFont(boldFont);

            CellStyle baseStyle = workbook.createCellStyle();
            baseStyle.setAlignment(HorizontalAlignment.CENTER);
            baseStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            baseStyle.setBorderBottom(BorderStyle.THIN);
            baseStyle.setBorderTop(BorderStyle.THIN);
            baseStyle.setBorderLeft(BorderStyle.THIN);
            baseStyle.setBorderRight(BorderStyle.THIN);
            baseStyle.setFont(normalFont);

            CellStyle boldStyle = workbook.createCellStyle();
            boldStyle.cloneStyleFrom(baseStyle);
            boldStyle.setFont(boldFont);

            // Style NT (nền xanh lá)
            CellStyle ntStyle = workbook.createCellStyle();
            ntStyle.cloneStyleFrom(baseStyle);
            ntStyle.setFillForegroundColor(IndexedColors.GREEN.getIndex());
            ntStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            ntStyle.setFont(normalFont);

            // Style chữ tím cho HCT1
            Font hct1Font = workbook.createFont();
            hct1Font.setFontName("Times New Roman");
            hct1Font.setColor(IndexedColors.BLUE.getIndex());
            CellStyle hct1Style = workbook.createCellStyle();
            hct1Style.cloneStyleFrom(baseStyle);
            hct1Style.setFont(hct1Font);

            // Style chữ cam cho HCT2
            Font hct2Font = workbook.createFont();
            hct2Font.setFontName("Times New Roman");
            hct2Font.setColor(IndexedColors.ORANGE.getIndex());
            CellStyle hct2Style = workbook.createCellStyle();
            hct2Style.cloneStyleFrom(baseStyle);
            hct2Style.setFont(hct2Font);

            // ======= Header =======
            LocalDate start = LocalDate.of(year, month, 1);
            int daysInMonth = start.lengthOfMonth();
            String[] weekdays = { "CN", "T2", "T3", "T4", "T5", "T6", "T7" };

            // --- Hàng 0: Tiêu đề chung ---
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("Lịch làm việc nhân viên - Tháng " +
                    String.format("%02d", month) + "/" + year);

            CellStyle titleStyle = workbook.createCellStyle();
            titleStyle.setAlignment(HorizontalAlignment.CENTER);
            titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            Font titleFont = workbook.createFont();
            titleFont.setFontName("Times New Roman");
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            titleStyle.setFont(titleFont);
            titleCell.setCellStyle(titleStyle);

            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, daysInMonth + 2));

            // --- Hàng 1: Ngày ---
            Row dayRow = sheet.createRow(1);
            dayRow.createCell(0).setCellValue("STT"); 
            dayRow.createCell(1).setCellValue("Họ tên");
            dayRow.createCell(2).setCellValue("Mã NV");

            for (int d = 1; d <= daysInMonth; d++) {
                Cell cell = dayRow.createCell(2 + d);
                cell.setCellValue(d);
                cell.setCellStyle(headerStyle);
            }

            // --- Hàng 2: Thứ ---
            Row weekdayRow = sheet.createRow(2);
            for (int d = 1; d <= daysInMonth; d++) {
                LocalDate date = LocalDate.of(year, month, d);
                String weekday = weekdays[date.getDayOfWeek().getValue() % 7];
                Cell cell = weekdayRow.createCell(2 + d);
                cell.setCellValue(weekday);
                cell.setCellStyle(headerStyle);
            }

            // Merge STT, Họ tên, Mã NV theo hàng dọc (row 1-2)
            sheet.addMergedRegion(new CellRangeAddress(1, 2, 0, 0));
            sheet.addMergedRegion(new CellRangeAddress(1, 2, 1, 1));
            sheet.addMergedRegion(new CellRangeAddress(1, 2, 2, 2));

            // ======= Dữ liệu nhân viên =======
            int rowIdx = 3;
            int stt = 1;
            for (EmployeeScheduleResponse emp : schedules) {
                Row row = sheet.createRow(rowIdx);

                Cell sttCell = row.createCell(0);
                sttCell.setCellValue(stt++);
                sttCell.setCellStyle(boldStyle);

                Cell nameCell = row.createCell(1);
                nameCell.setCellValue(emp.getEmployeeName());
                nameCell.setCellStyle(boldStyle);

                Cell codeCell = row.createCell(2);
                codeCell.setCellValue(emp.getEmployeeCode());
                codeCell.setCellStyle(boldStyle);

                for (int d = 1; d <= daysInMonth; d++) {
                    String dateKey = LocalDate.of(year, month, d).toString();
                    String shiftCode = emp.getDays().getOrDefault(dateKey, "NT"); // mặc định NT
                    Cell cell = row.createCell(2 + d);
                    cell.setCellValue(shiftCode);

                    if ("NT".equals(shiftCode)) {
                        cell.setCellStyle(ntStyle);
                    } else if (shiftCode.startsWith("HCT1")) {
                        cell.setCellStyle(hct1Style);
                    } else if (shiftCode.startsWith("HCT2")) {
                        cell.setCellStyle(hct2Style);
                    } else {
                        cell.setCellStyle(baseStyle);
                    }
                }
                rowIdx++;
            }

            // Auto-size
            for (int i = 0; i < daysInMonth + 3; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xuất Excel: " + e.getMessage(), e);
        }
    }

}