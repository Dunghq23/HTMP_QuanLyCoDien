package htmp.codien.quanlycodien.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EmployeeStatusResponse {
    private String code; // ADMIN, HEAD, ...
    private String description; // Quản trị viên phòng, Trưởng phòng, ...
}