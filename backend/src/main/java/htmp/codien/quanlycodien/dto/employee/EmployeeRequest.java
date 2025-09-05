package htmp.codien.quanlycodien.dto.employee;

import htmp.codien.quanlycodien.model.enums.EmployeeStatus;
import htmp.codien.quanlycodien.model.enums.Role;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EmployeeRequest {
    Long id;
    String code;
    String name;
    String position;
    String phone;
    Role role;
    Long departmentId;
    Long positionId;
    EmployeeStatus status;
}