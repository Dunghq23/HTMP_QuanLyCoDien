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
public class EmployeeResponse {
    Long id;
    String code;
    String name;
    String phone;
    Role role;
    Long parentDepartmentId;
    String displayDepartment;
    Long departmentId;
    String departmentName;
    Long positionId;
    String positionName;
    EmployeeStatus status;
}