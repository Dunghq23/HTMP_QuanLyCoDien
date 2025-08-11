package htmp.codien.quanlycodien.dto.employee;

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
    String role;
    Long departmentId;
}
