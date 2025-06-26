package htmp.codien.quanlycodien.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderDTO {
    Long id;
    String documentNumber;
    Long employeeId;
    String employeeName;
    LocalDate orderDate;
    String status;
    String note;
}
