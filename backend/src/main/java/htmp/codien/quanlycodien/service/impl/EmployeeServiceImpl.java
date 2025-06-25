package htmp.codien.quanlycodien.service.impl;

import htmp.codien.quanlycodien.dto.EmployeeDTO;
import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.repository.EmployeeRepository;
import htmp.codien.quanlycodien.service.EmployeeService;
import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final PasswordEncoder passwordEncoder;
    private final EmployeeRepository employeeRepository;
    private final ModelMapper modelMapper;

    private EmployeeDTO toDTO(Employee employee) {
        return modelMapper.map(employee, EmployeeDTO.class);
    }

    private Employee toEntity(EmployeeDTO dto) {
        return modelMapper.map(dto, Employee.class);
    }

    @Override
    public List<EmployeeDTO> findAll() {
        return employeeRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<EmployeeDTO> findById(Long id) {
        return employeeRepository.findById(id).map(this::toDTO);
    }

    @Override
    public EmployeeDTO save(EmployeeDTO employeeDTO) {
        Employee employee = toEntity(employeeDTO);

        // Nếu là nhân viên mới (chưa có ID), gán mật khẩu mặc định đã mã hóa
        if (employee.getId() == null) {
            employee.setPassword(passwordEncoder.encode("Htmp1234"));
        }

        Employee saved = employeeRepository.save(employee);
        return toDTO(saved);
    }
}