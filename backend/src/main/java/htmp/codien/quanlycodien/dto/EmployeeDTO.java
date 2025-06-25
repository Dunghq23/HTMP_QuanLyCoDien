package htmp.codien.quanlycodien.dto;

import java.time.LocalDateTime;
import java.util.List;

import htmp.codien.quanlycodien.model.TaskAssignment;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EmployeeDTO {
    Long id;
    String code;
    String name;
    String position;
    String phone;
    String role;
    LocalDateTime createdAt;
    List<TaskAssignment> assignments;
}
