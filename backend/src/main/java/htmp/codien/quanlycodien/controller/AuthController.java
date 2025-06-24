package htmp.codien.quanlycodien.controller;

import htmp.codien.quanlycodien.common.ApiResponse;
import htmp.codien.quanlycodien.common.ResponseUtil;
import htmp.codien.quanlycodien.dto.AuthRequestDTO;
import htmp.codien.quanlycodien.dto.AuthResponseDTO;
import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.repository.EmployeeRepository;
import htmp.codien.quanlycodien.security.JwtTokenProvider;
import htmp.codien.quanlycodien.service.AuthService;
import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.annotation.JsonCreator.Mode;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@RequestBody AuthRequestDTO authRequest) {
        AuthResponseDTO response = authService.login(authRequest.getCode(), authRequest.getPassword());
        return ResponseUtil.success(response, "Đăng nhập thành công");
    }
}
