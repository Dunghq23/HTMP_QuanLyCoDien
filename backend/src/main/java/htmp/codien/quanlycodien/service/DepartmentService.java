package htmp.codien.quanlycodien.service;

import java.util.List;

import htmp.codien.quanlycodien.dto.department.DepartmentRequest;
import htmp.codien.quanlycodien.dto.department.DepartmentRootDTO;
import htmp.codien.quanlycodien.model.Department;

public interface DepartmentService {
    Department getDepartmentById(Long id);
    List<DepartmentRootDTO> getRootDepartments(); // Lấy danh sách phòng ban gốc
    List<Department> getSubDepartments(Long parentId);
    void createDepartment(DepartmentRequest department);
    void updateDepartment(Long id, DepartmentRequest department);
    void deleteDepartment(Long id);
}