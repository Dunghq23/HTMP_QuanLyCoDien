package htmp.codien.quanlycodien.controller;

import htmp.codien.quanlycodien.common.ApiResponse;
import htmp.codien.quanlycodien.common.ResponseUtil;
import htmp.codien.quanlycodien.dto.DailyWorkReportDTO;
import htmp.codien.quanlycodien.service.DailyWorkReportService;
import lombok.AllArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/daily-reports")
@AllArgsConstructor
public class DailyWorkReportController {

    private final DailyWorkReportService reportService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DailyWorkReportDTO>>> getReports(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<DailyWorkReportDTO> reports;

        if (employeeId == null && date == null) {
            // Không truyền gì => trả về tất cả
            reports = reportService.getAllReports();
        } else if (employeeId == null && date != null) {
            // Chỉ truyền date => lọc theo ngày
            reports = reportService.getReportsByDate(date);
        } else {
            // Có truyền employeeId và/hoặc date => lọc theo
            reports = reportService.getReportsByEmployeeIdAndDate(employeeId, date);
        }

        return ResponseUtil.success(reports, "Lấy danh sách công việc thành công");
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> createReport(
            @RequestPart(name = "file", required = false) MultipartFile file,
            @RequestParam(name = "employeeId") Long employeeId,
            @RequestParam(name = "reportDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate reportDate,
            @RequestParam(name = "startTime") @DateTimeFormat(pattern = "HH:mm") LocalTime startTime,
            @RequestParam(name = "endTime") @DateTimeFormat(pattern = "HH:mm") LocalTime endTime,
            @RequestParam(name = "taskDescription") String taskDescription) {
        try {
            reportService.createReport(employeeId, reportDate, startTime, endTime, taskDescription, file);
            return ResponseUtil.success(null, "Tạo báo cáo thành công");
        } catch (Exception e) {
            return ResponseUtil.badRequest("Lỗi khi tạo báo cáo");
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> updateReport(
            @PathVariable Long id,
            @RequestPart("employeeId") String employeeId,
            @RequestPart("reportDate") String reportDate,
            @RequestPart("startTime") String startTime,
            @RequestPart("endTime") String endTime,
            @RequestPart("taskDescription") String taskDescription,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            reportService.updateReport(id, employeeId, reportDate, startTime, endTime, taskDescription, file);
            return ResponseUtil.success(null, "Cập nhật báo cáo thành công");
        } catch (Exception e) {
            return ResponseUtil.badRequest("Cập nhật thất bại: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReport(@PathVariable Long id) {
        try {
            reportService.deleteReport(id);
            return ResponseUtil.success(null, "Xóa báo cáo thành công");
        } catch (Exception e) {
            return ResponseUtil.badRequest("Xóa thất bại: " + e.getMessage());
        }
    }

}
