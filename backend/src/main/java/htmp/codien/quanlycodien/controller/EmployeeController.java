package htmp.codien.quanlycodien.controller;

import htmp.codien.quanlycodien.common.ApiResponse;
import htmp.codien.quanlycodien.common.ResponseUtil;
import htmp.codien.quanlycodien.dto.employee.EmployeeRequest;
import htmp.codien.quanlycodien.dto.employee.EmployeeResponse;
import htmp.codien.quanlycodien.dto.employee.EmployeeStatusResponse;
import htmp.codien.quanlycodien.exception.ResourceNotFoundException;
import htmp.codien.quanlycodien.model.enums.EmployeeStatus;
import htmp.codien.quanlycodien.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // GET all employees
    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getAll() {
        List<EmployeeResponse> employees = employeeService.findAll();
        return ResponseUtil.success(employees, "Lấy danh sách nhân viên thành công");
    }

    // GET employee by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getById(@PathVariable Long id) {
        EmployeeResponse employee = employeeService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return ResponseUtil.success(employee, "Lấy nhân viên thành công");
    }

    // GET employees by department ID
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getByDepartment(@PathVariable Long departmentId) {
        List<EmployeeResponse> employees = employeeService.findByDepartment(departmentId);
        if (employees.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy nhân viên trong phòng ban " + departmentId);
        }
        return ResponseUtil.success(employees, "Lấy danh sách nhân viên theo phòng ban thành công");
    }

    // POST create new employee
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> create(@RequestBody EmployeeRequest dto) {
        employeeService.save(dto);
        return ResponseUtil.success(null, "Tạo nhân viên thành công");
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> update(@PathVariable Long id, @RequestBody EmployeeRequest dto) {
        employeeService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        dto.setId(id); // ensure id is set
        employeeService.save(dto);
        return ResponseUtil.success(null, "Cập nhật nhân viên thành công");
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<List<EmployeeStatusResponse>>> getAllEmployeeStatus() {
        List<EmployeeStatusResponse> roleList = Arrays.stream(EmployeeStatus.values())
                .map(role -> new EmployeeStatusResponse(role.name(), role.getDescription()))
                .collect(Collectors.toList());
        return ResponseUtil.success(roleList, "Lấy danh sách vai trò thành công");
    }
}