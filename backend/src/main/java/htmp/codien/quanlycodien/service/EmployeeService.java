package htmp.codien.quanlycodien.service;

import java.util.List;
import java.util.Optional;

import htmp.codien.quanlycodien.dto.EmployeeRequest;
import htmp.codien.quanlycodien.dto.EmployeeResponse;

public interface EmployeeService {
    List<EmployeeResponse> findAll();
    Optional<EmployeeResponse> findById(Long id);
    void save(EmployeeRequest request);
}
