package htmp.codien.quanlycodien.repository;

import htmp.codien.quanlycodien.model.Department;
import htmp.codien.quanlycodien.model.Employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByCode(String code);

    List<Employee> findByDepartment(Department department);

    List<Employee> findByDepartment_Id(Long departmentId);

    @Query(value = """
            WITH RECURSIVE sub_departments AS (
                SELECT d.id, d.parent_department_id
                FROM departments d
                WHERE d.id = :departmentId

                UNION ALL

                SELECT child.id, child.parent_department_id
                FROM departments child
                INNER JOIN sub_departments sd ON child.parent_department_id = sd.id
            )
            SELECT e.*
            FROM employees e
            JOIN sub_departments sd ON e.department_id = sd.id
            """, nativeQuery = true)
    List<Employee> findEmployeesInDepartmentAndSubDepartments(@Param("departmentId") Long departmentId);
}
