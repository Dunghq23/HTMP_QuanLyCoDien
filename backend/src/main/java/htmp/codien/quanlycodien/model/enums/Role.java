package htmp.codien.quanlycodien.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Role {
    SUPERADMIN("Quản trị hệ thống"),
    ADMIN("Quản trị viên phòng"),
    HEAD("Trưởng phòng"),
    DIRECTOR("Giám đốc"),
    LEADER("Trưởng nhóm"),
    EMPLOYEE("Nhân viên"),
    HR("Nhân sự"),
    MANAGER("Quản lý");

    private final String description;
}