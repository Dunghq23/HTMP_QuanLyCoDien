package htmp.codien.quanlycodien.dto.dailyTask;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DailyWorkReportItemDTO {
    private Long id;
    private LocalDate reportDate;
    private String taskDescription;
    private LocalTime startTime;
    private LocalTime endTime;
    private String filePath;
}