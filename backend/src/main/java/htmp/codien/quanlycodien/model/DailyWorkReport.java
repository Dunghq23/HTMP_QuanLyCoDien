package htmp.codien.quanlycodien.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import htmp.codien.quanlycodien.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "daily_work_reports")
public class DailyWorkReport  extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate reportDate;

    @Column(name = "task_description", columnDefinition = "TEXT")
    private String taskDescription;

    private LocalTime startTime;

    private LocalTime endTime;

    private String filePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
}
