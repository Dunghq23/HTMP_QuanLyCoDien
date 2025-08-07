package htmp.codien.quanlycodien.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import htmp.codien.quanlycodien.model.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByParentDepartmentIsNull(); // Lấy phòng ban gốc
    List<Department> findByParentDepartment(Department parentDepartment); // Lấy phòng ban con theo phòng ban cha
}