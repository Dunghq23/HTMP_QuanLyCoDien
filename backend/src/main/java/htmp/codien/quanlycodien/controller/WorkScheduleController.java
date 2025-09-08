package htmp.codien.quanlycodien.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import htmp.codien.quanlycodien.common.ApiResponse;
import htmp.codien.quanlycodien.common.ResponseUtil;
import htmp.codien.quanlycodien.dto.schedule.EmployeeScheduleRequest;
import htmp.codien.quanlycodien.dto.schedule.EmployeeScheduleResponse;
import htmp.codien.quanlycodien.service.WorkScheduleService;
import lombok.RequiredArgsConstructor;

import java.io.ByteArrayInputStream;
import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/work-schedules")
@RequiredArgsConstructor
public class WorkScheduleController {
        private final WorkScheduleService workScheduleService;

        @GetMapping("/department/{departmentId}")
        public ResponseEntity<ApiResponse<List<EmployeeScheduleResponse>>> getWorkScheduleByDepartment(
                        @PathVariable Long departmentId,
                        @RequestParam(required = false) String month,
                        @RequestParam(required = false) String year) {
                List<EmployeeScheduleResponse> schedules = workScheduleService.getWorkScheduleByDepartment(departmentId,
                                month,
                                year);
                return ResponseUtil.success(schedules, "Lấy lịch làm việc thành công");
        }

        @GetMapping("/employee/{employeeId}")
        public ResponseEntity<ApiResponse<EmployeeScheduleResponse>> getWorkScheduleByEmployee(
                        @PathVariable Long employeeId,
                        @RequestParam(required = false) String month,
                        @RequestParam(required = false) String year) {
                EmployeeScheduleResponse schedule = workScheduleService.getWorkScheduleByEmployee(employeeId, month,
                                year);
                return ResponseUtil.success(schedule, "Lấy lịch làm việc thành công");
        }

        @PostMapping
        public ResponseEntity<ApiResponse<Void>> saveSchedulesOnce(@RequestBody List<EmployeeScheduleRequest> request) {
                workScheduleService.saveSchedulesOnce(request);
                return ResponseUtil.success(null, "Xếp lịch làm việc thành công");
        }

        @GetMapping("/export")
        public ResponseEntity<InputStreamResource> exportWorkSchedule(
                        @RequestParam Long departmentId,
                        @RequestParam int year,
                        @RequestParam int month) {

                ByteArrayInputStream in = workScheduleService.exportWorkSchedule(departmentId, year, month);

                String filename = String.format("schedule-dept-%d-%d-%d.xlsx", departmentId, year, month);

                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "attachment; filename=" + filename);

                return ResponseEntity.ok()
                                .headers(headers)
                                .contentType(
                                                MediaType.parseMediaType(
                                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                                .body(new InputStreamResource(in));
        }
}