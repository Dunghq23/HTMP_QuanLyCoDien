package htmp.codien.quanlycodien.service;

import java.util.List;
import java.util.Optional;

import htmp.codien.quanlycodien.dto.EmployeeDTO;

public interface EmployeeService {
    List<EmployeeDTO> findAll();
    Optional<EmployeeDTO> findById(Long id);
    EmployeeDTO save(EmployeeDTO employeeDTO);
}
