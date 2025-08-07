package htmp.codien.quanlycodien.dto;

import lombok.Data;

@Data
public class DepartmentRequest {
    private String name;
    private Long parentDepartmentId; // null nếu là phòng ban gốc
}