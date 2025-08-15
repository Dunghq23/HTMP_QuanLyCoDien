package htmp.codien.quanlycodien.dto.department;

import lombok.Data;

@Data
public class DepartmentRequest {
    private String name;
    private String code;
    private Long parentDepartmentId; // null nếu là phòng ban gốc
}