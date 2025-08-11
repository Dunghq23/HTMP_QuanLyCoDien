package htmp.codien.quanlycodien.dto.newModel;

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
public class JigDetailDTO {
    Long id;
    Process process;
    String name;
    String erpCode;
}
