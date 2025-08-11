package htmp.codien.quanlycodien.service;

import java.util.List;
import java.util.Optional;

import htmp.codien.quanlycodien.dto.employee.EmployeeRequest;
import htmp.codien.quanlycodien.dto.employee.EmployeeResponse;

public interface EmployeeService {
    List<EmployeeResponse> findAll();
    Optional<EmployeeResponse> findById(Long id);
    void save(EmployeeRequest request);
}
