package htmp.codien.quanlycodien.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorAware") // trỏ đến bean auditorAware
public class JpaConfig {
    @Bean
    public AuditorAware<String> auditorAware() {
        // Spring sẽ tự inject EmployeeRepository vào đây
        return new AuditorAwareImpl();
    }
}