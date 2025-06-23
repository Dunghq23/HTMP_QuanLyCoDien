package htmp.codien.quanlycodien.controller;

import htmp.codien.quanlycodien.dto.AuthRequestDTO;
import htmp.codien.quanlycodien.dto.AuthResponseDTO;
import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.repository.EmployeeRepository;
import htmp.codien.quanlycodien.security.JwtTokenProvider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO authRequest) {
        Employee user = employeeRepository.findByCode(authRequest.getCode())
                .orElseThrow(() -> new UsernameNotFoundException("Mã nhân viên không tồn tại"));

        if (!passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Mật khẩu không đúng");
        }

        String token = jwtTokenProvider.generateToken(user.getCode(), user.getRole());
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }
}
