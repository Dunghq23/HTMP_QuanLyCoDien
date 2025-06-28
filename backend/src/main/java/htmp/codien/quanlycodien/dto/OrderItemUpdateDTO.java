package htmp.codien.quanlycodien.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderItemUpdateDTO {
    private LocalDate receivedDate;
    private Double quantityReceived;
}
