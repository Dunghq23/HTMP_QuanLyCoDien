package htmp.codien.quanlycodien.controller;

import htmp.codien.quanlycodien.common.ApiResponse;
import htmp.codien.quanlycodien.common.ResponseUtil;
import htmp.codien.quanlycodien.dto.DepartmentRequest;
import htmp.codien.quanlycodien.dto.DepartmentRootDTO;
import htmp.codien.quanlycodien.model.Department;
import htmp.codien.quanlycodien.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {
    private final DepartmentService departmentService;

    // Lấy chi tiết phòng ban
    @GetMapping("/{departmentId}")
    public ResponseEntity<ApiResponse<Department>> getDepartmentById(@PathVariable Long departmentId) {
        Department department = departmentService.getDepartmentById(departmentId);
        return ResponseUtil.success(department, "Lấy thông tin phòng ban thành công");
    }

    // Lấy phòng ban gốc
    @GetMapping("/root")
    public ResponseEntity<ApiResponse<List<DepartmentRootDTO>>> getRootDepartments() {
        List<DepartmentRootDTO> rootDepartments = departmentService.getRootDepartments();
        return ResponseUtil.success(rootDepartments, "Lấy danh sách phòng ban gốc thành công");
    }

    // Lấy phòng ban con
    @GetMapping("/sub")
    public ResponseEntity<ApiResponse<List<Department>>> getSubDepartments(@RequestParam Long parentId) {
        List<Department> subDepartments = departmentService.getSubDepartments(parentId);
        return ResponseUtil.success(subDepartments, "Lấy danh sách bộ phận thành công");
    }

    // Tạo phòng ban mới
    @PostMapping("")
    public ResponseEntity<ApiResponse<Void>> createDepartment(@RequestBody DepartmentRequest request) {
        departmentService.createDepartment(request);
        return ResponseUtil.success(null, "Tạo phòng ban thành công");
    }

    // Cập nhật phòng ban
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateDepartment(
            @PathVariable Long id,
            @RequestBody DepartmentRequest department) {
        departmentService.updateDepartment(id, department);
        return ResponseUtil.success(null, "Cập nhật phòng ban thành công");
    }

    // Xóa phòng ban
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseUtil.success(null, "Xóa phòng ban thành công");
    }
}
