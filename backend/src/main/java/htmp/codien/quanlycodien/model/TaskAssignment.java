package htmp.codien.quanlycodien.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "task_employees")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class TaskAssignment {

    @EmbeddedId
    TaskEmployeeId id;

    @ManyToOne
    @MapsId("taskId")
    @JoinColumn(name = "task_id")
    Task task;

    @ManyToOne
    @MapsId("employeeId")
    @JoinColumn(name = "employee_id")
    Employee employee;

    @Column(name = "assigned_at")
    LocalDateTime assignedAt;
}
