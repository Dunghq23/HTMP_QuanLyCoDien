package htmp.codien.quanlycodien.controller;

import htmp.codien.quanlycodien.common.ApiResponse;
import htmp.codien.quanlycodien.common.ResponseUtil;
import htmp.codien.quanlycodien.dto.DailyWorkReportDTO;
import htmp.codien.quanlycodien.service.DailyWorkReportService;
import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/daily-reports")
@AllArgsConstructor
public class DailyWorkReportController {

    private final DailyWorkReportService reportService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DailyWorkReportDTO>>> getAllReports() {
        List<DailyWorkReportDTO> reports = reportService.getAllReports();
        return ResponseUtil.success(reports, "Lấy danh sách công việc thành công");
    }
}
