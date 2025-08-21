package htmp.codien.quanlycodien.dto.dailyTask;

import java.time.LocalTime;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeWorkReportDTO {
    Long employeeId;
    String employeeCode;
    String employeeName;
    String departmentName;
    String positionName;
    LocalTime startTime;
    LocalTime endTime;
    double workEfficiency;
    List<DailyWorkReportItemDTO> reports;
}