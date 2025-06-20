package htmp.codien.quanlycodien.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class TaskEmployeeId implements Serializable {

    @Column(name = "task_id")
    Long taskId;

    @Column(name = "employee_id")
    Long employeeId;
}
