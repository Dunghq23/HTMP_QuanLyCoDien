package htmp.codien.quanlycodien.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import htmp.codien.quanlycodien.common.ApiResponse;
import htmp.codien.quanlycodien.common.ResponseUtil;
import htmp.codien.quanlycodien.dto.newModel.ProcessDTO;
import htmp.codien.quanlycodien.exception.ResourceNotFoundException;
import htmp.codien.quanlycodien.service.ProcessService;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/processes")
@RequiredArgsConstructor
public class ProcessController {
    private final ProcessService processService;

    @PostMapping()
    public ResponseEntity<ApiResponse<Void>> postMethodName(
            @RequestParam Long productId,
            @RequestParam Long employeeId,
            @RequestParam String type,
            @RequestParam String name,
            @RequestParam(required = false) String erpCode,
            @RequestParam(required = false) String jigName) {

        try {
            processService.createProcess(productId, employeeId, type, name, erpCode, jigName);
            return ResponseUtil.success(null, "Thêm công đoạn thành công");

        } catch (ResourceNotFoundException e) {
            return ResponseUtil.notFound(e.getMessage());
        } catch (Exception e) {
            return ResponseUtil.badRequest("Lỗi khi tạo đơn hàng từ Excel: " + e.getMessage());
        }
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<ProcessDTO>>> getAllProcessByProductId(@RequestParam Long productId) {
        List<ProcessDTO> processDTOs = processService.getAllProcessByProductId(productId);
        return ResponseUtil.success(processDTOs, "Lấy danh sách công đoạn thành công");
    }

    @PatchMapping("/stages/{processStageId}")
    public ResponseEntity<ApiResponse<Void>> updateProcessStage(
            @PathVariable Long processStageId,
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) String description) {

        try {
            processService.updateProcessStage(processStageId, date, description);
            return ResponseUtil.success(null, "Cập nhật công đoạn thành công");
        } catch (ResourceNotFoundException e) {
            return ResponseUtil.notFound(e.getMessage());
        } catch (Exception e) {
            return ResponseUtil.badRequest("Lỗi khi cập nhật công đoạn: " + e.getMessage());
        }
    }

    @PatchMapping("/{processId}")
    public ResponseEntity<ApiResponse<Void>> updateProcess(
            @PathVariable Long processId,
            @RequestParam(required = true) Double cost) {

        try {
            processService.updateProcess(processId, cost);
            return ResponseUtil.success(null, "Cập nhật công đoạn thành công");
        } catch (ResourceNotFoundException e) {
            return ResponseUtil.notFound(e.getMessage());
        } catch (Exception e) {
            return ResponseUtil.badRequest("Lỗi khi cập nhật công đoạn: " + e.getMessage());
        }
    }

    @DeleteMapping("/{processId}")
    public ResponseEntity<ApiResponse<Void>> deleteProcess(@PathVariable Long processId) {
        try {
            processService.deleteProcess(processId);
            return ResponseUtil.success(null, "Xóa công đoạn thành công");
        } catch (ResourceNotFoundException e) {
            return ResponseUtil.notFound(e.getMessage());
        } catch (Exception e) {
            return ResponseUtil.badRequest("Lỗi khi xóa công đoạn: " + e.getMessage());
        }
    }

    

}
