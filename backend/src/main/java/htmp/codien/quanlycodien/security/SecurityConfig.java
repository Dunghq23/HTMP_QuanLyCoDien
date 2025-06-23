package htmp.codien.quanlycodien.security;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.springframework.security.config.Customizer.withDefaults;

import java.util.List;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    // Bộ lọc để kiểm tra JWT trong request
    private final JwtAuthenticationFilter jwtFilter;

    /**
     * Cấu hình bảo mật chính: xác định quyền truy cập và filter JWT
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Cho phép xử lý CORS
                .cors(withDefaults())

                // Tắt CSRF (vì dùng JWT nên không cần CSRF token)
                .csrf(csrf -> csrf.disable())

                // Cấu hình quyền truy cập các đường dẫn API
                .authorizeHttpRequests(auth -> auth
                        // Cho phép không cần login khi gọi các API public (tùy sửa đổi theo nhu cầu)
                        .requestMatchers("/login").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()

                        // Các request khác yêu cầu xác thực JWT
                        .anyRequest().authenticated())

                // Chèn filter JWT để xử lý token trước khi xử lý xác thực bằng
                // username/password
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Cấu hình lấy `AuthenticationManager` từ Spring context
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Cấu hình CORS: cho phép mọi domain gọi đến API (dùng cho frontend)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Cho phép tất cả nguồn (chỉ nên dùng trong môi trường DEV)
        config.setAllowedOriginPatterns(List.of("*"));

        // Cho phép các method HTTP gọi đến server
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Cho phép tất cả các header
        config.setAllowedHeaders(List.of("*"));

        // Nếu frontend dùng cookie, session, token, thì nên bật dòng này
        config.setAllowCredentials(true);

        // Áp dụng cho tất cả URL
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
