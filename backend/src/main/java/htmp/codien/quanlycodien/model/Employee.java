package htmp.codien.quanlycodien.model;

import java.time.LocalDateTime;
import java.util.List;

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

    @Column(name = "code")
    String code;

    @Column(name = "name")
    String name;

    @Column(name = "position")
    String position;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @OneToMany(mappedBy = "employee")
    List<TaskAssignment> assignments;
}