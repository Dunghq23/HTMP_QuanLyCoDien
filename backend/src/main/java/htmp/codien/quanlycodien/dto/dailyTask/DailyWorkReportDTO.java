package htmp.codien.quanlycodien.dto.dailyTask;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DailyWorkReportDTO {
    private Long id;
    private LocalDate reportDate;
    private String taskDescription;
    private LocalTime startTime;
    private LocalTime endTime;
    private String filePath;
    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
