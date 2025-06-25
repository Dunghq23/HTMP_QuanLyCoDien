package htmp.codien.quanlycodien.controller;

import htmp.codien.quanlycodien.common.ApiResponse;
import htmp.codien.quanlycodien.common.ResponseUtil;
import htmp.codien.quanlycodien.dto.EmployeeDTO;
import htmp.codien.quanlycodien.exception.ResourceNotFoundException;
import htmp.codien.quanlycodien.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // GET all employees
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getAll() {
        List<EmployeeDTO> employees = employeeService.findAll();
        return ResponseUtil.success(employees, "Lấy danh sách nhân viên thành công");
    }

    // GET employee by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getById(@PathVariable Long id) {
        EmployeeDTO employee = employeeService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return ResponseUtil.success(employee, "Lấy nhân viên thành công");
    }

    // POST create new employee
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> create(@RequestBody EmployeeDTO dto) {
        EmployeeDTO created = employeeService.save(dto);
        return ResponseUtil.success(created, "Tạo nhân viên thành công");
    }

    // PUT update employee
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> update(@PathVariable Long id, @RequestBody EmployeeDTO dto) {
        employeeService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        dto.setId(id); // ensure id is set
        EmployeeDTO updated = employeeService.save(dto);
        return ResponseUtil.success(updated, "Cập nhật nhân viên thành công");
    }
}