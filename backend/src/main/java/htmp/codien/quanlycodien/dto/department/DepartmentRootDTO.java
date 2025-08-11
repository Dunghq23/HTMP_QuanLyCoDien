package htmp.codien.quanlycodien.dto.department;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DepartmentRootDTO {
    Long id;
    String name;
    Integer subDepartmentCount; // Số lượng phòng ban con
    Integer employeeCount; // Số lượng nhân viên trong phòng ban

    // Danh sách phòng ban con
    List<DepartmentSubDTO> subDepartments;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class DepartmentSubDTO {
        Long id;
        String name;
        Integer employeeCount;
    }
}