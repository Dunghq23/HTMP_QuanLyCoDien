package htmp.codien.quanlycodien.dto.role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RoleResponse {
    private String code; // ADMIN, HEAD, ...
    private String description; // Quản trị viên phòng, Trưởng phòng, ...
}