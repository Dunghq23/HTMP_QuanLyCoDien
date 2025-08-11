package htmp.codien.quanlycodien.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import htmp.codien.quanlycodien.dto.auth.AuthResponseDTO;
import htmp.codien.quanlycodien.dto.employee.EmployeeResponse;
import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.repository.EmployeeRepository;
import htmp.codien.quanlycodien.security.JwtTokenProvider;
import htmp.codien.quanlycodien.service.AuthService;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final ModelMapper modelMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeRepository employeeRepository;

    @Override
    public AuthResponseDTO login(String code, String password) {
        Employee user = employeeRepository.findByCode(code)
                .orElseThrow(() -> new UsernameNotFoundException("Mã nhân viên không tồn tại"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Mật khẩu không đúng");
        }
        String token = jwtTokenProvider.generateToken(user.getCode(), user.getRole());
        EmployeeResponse userDto = modelMapper.map(user, EmployeeResponse.class);
        return new AuthResponseDTO(token, userDto);
    }

    @Override
    public AuthResponseDTO refreshToken(String token) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'refreshToken'");
    }

    @Override
    public AuthResponseDTO getUserInfo(String token) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getUserInfo'");
    }

    @Override
    public void logout(String token) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'logout'");
    }

}
