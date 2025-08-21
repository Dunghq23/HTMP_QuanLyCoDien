package htmp.codien.quanlycodien.security;

import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.repository.EmployeeRepository;
import lombok.AllArgsConstructor;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final EmployeeRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Employee user = userRepository.findByCode(username)
                   .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng"));

        // Trả về UserDetails mà Spring Security hiểu
        return new CustomUserDetails(user);
    }
}
