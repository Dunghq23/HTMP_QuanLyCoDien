package htmp.codien.quanlycodien.service;

import java.time.LocalDate;
import java.util.List;

import htmp.codien.quanlycodien.dto.ProcessDTO;

public interface ProcessService {
    void createProcess(Long productId, Long employeeId, String type, String name, String erpCode, String jigName);

    List<ProcessDTO> getAllProcessByProductId(Long productId);

    void updateProcessStage(Long id, LocalDate date, String description);

    void updateProcess(Long processId, Double cost);

    void deleteProcess(Long processId);
}
