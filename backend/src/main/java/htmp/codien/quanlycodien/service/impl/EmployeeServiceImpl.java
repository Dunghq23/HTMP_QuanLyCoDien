package htmp.codien.quanlycodien.service.impl;

import htmp.codien.quanlycodien.dto.employee.EmployeeRequest;
import htmp.codien.quanlycodien.dto.employee.EmployeeResponse;
import htmp.codien.quanlycodien.exception.ResourceNotFoundException;
import htmp.codien.quanlycodien.model.Department;
import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.model.Position;
import htmp.codien.quanlycodien.repository.DepartmentRepository;
import htmp.codien.quanlycodien.repository.EmployeeRepository;
import htmp.codien.quanlycodien.repository.PositionRepository;
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
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepositoty;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeRepository employeeRepository;
    private final ModelMapper modelMapper;

    private EmployeeResponse toResponse(Employee employee) {
        EmployeeResponse response = modelMapper.map(employee, EmployeeResponse.class);
        if (employee.getDepartment() != null) {
            if (employee.getDepartment().getParentDepartment() != null) {
                response.setDepartmentId(employee.getDepartment().getParentDepartment().getId());
                response.setDepartmentName(employee.getDepartment().getParentDepartment().getName());
            } else {
                response.setDepartmentId(employee.getDepartment().getId());
                response.setDepartmentName(employee.getDepartment().getName());
            }
        }
        if (employee.getPosition() != null) {
            response.setPositionCode(employee.getPosition().getCode());
            response.setPositionName(employee.getPosition().getName());
        }
        return response;
    }

    private Employee toEntity(EmployeeRequest dto) {
        return modelMapper.map(dto, Employee.class);
    }

    @Override
    public List<EmployeeResponse> findAll() {
        return employeeRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<EmployeeResponse> findById(Long id) {
        return employeeRepository.findById(id).map(this::toResponse);
    }

    @Override
    public void save(EmployeeRequest request) {
        Employee employee = toEntity(request);

        // Nếu là nhân viên mới (chưa có ID), gán mật khẩu mặc định đã mã hóa
        if (employee.getId() == null) {
            employee.setPassword(passwordEncoder.encode("Htmp1234"));
        } else {
            // Cập nhật → giữ mật khẩu cũ nếu không truyền
            Employee existing = employeeRepository.findById(employee.getId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Employee not found with id: " + employee.getId()));

            if (employee.getPassword() == null) {
                employee.setPassword(existing.getPassword());
            }
        }

        if (employee.getDepartment() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy phòng ban"));
            employee.setDepartment(department);
        }
        if (employee.getPosition() != null) {
            Position position = positionRepositoty.findById(request.getPositionId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy chức vụ"));
            employee.setPosition(position);
        }

        employeeRepository.save(employee);
    }

    @Override
    public List<EmployeeResponse> findByDepartment(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Phòng ban không tồn tại"));
        return employeeRepository.findByDepartment(department).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}