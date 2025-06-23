// src/main/java/.../config/WebConfig.java
package htmp.codien.quanlycodien.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // hoặc "/api/**"
                .allowedOriginPatterns("*") // ✅ đúng cú pháp khi có allowCredentials
                // .allowedOrigins("http://localhost:3000")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true); // nếu có dùng cookie/session
    }
}
