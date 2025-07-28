package htmp.codien.quanlycodien.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProcessDTO {
    Long id;
    String employeeName;
    String type;
    String name;
    double cost;
    JigDetailDTO jigDetail;
    List<ProcessStageDTO> processStageList;
}