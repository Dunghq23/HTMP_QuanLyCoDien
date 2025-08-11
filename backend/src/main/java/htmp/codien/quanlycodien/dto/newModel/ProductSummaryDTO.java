package htmp.codien.quanlycodien.dto.newModel;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductSummaryDTO {
    List<PhaseSummaryDTO> tayGa;
    List<PhaseSummaryDTO> banCat;
    List<PhaseSummaryDTO> jig;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class PhaseSummaryDTO {
        String name;
        int value;
    }
}
