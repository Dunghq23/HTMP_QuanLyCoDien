package htmp.codien.quanlycodien.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductTestByEmployeeResponse {
    private String employeeName;
    private int tayGaCount;
    private int banCatCount;
    private int jigCount;
}
