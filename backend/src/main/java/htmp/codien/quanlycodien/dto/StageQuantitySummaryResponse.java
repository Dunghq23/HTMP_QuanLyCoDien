package htmp.codien.quanlycodien.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StageQuantitySummaryResponse {
    Integer designing;
    Integer purchasing;
    Integer processing;
    Integer assembling;
    Integer delivering;
    Integer completed;
    Integer isBeing;
}
