package htmp.codien.quanlycodien.repository;

import htmp.codien.quanlycodien.model.Department;
import htmp.codien.quanlycodien.model.Employee;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByCode(String code);

    List<Employee> findByDepartment(Department department);

    List<Employee> findByDepartment_Id(Long departmentId);
}
