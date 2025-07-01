package htmp.codien.quanlycodien.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "employees")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "code", length = 50, unique = true, nullable = false)
    String code;

    @Column(name = "name", length = 255, nullable = false)
    String name;

    @Column(name = "position", length = 100, nullable = false)
    String position;

    @Column(name = "phone", length = 20, unique = true, nullable = false)
    String phone;

    @Column(name = "password", length = 255, nullable = false)
    String password;

    @Column(name = "role", length = 50, nullable = false)
    String role;

    @Column(name = "created_at")
    LocalDateTime createdAt;
}