package htmp.codien.quanlycodien.repository;

import htmp.codien.quanlycodien.model.PhaseStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PhaseStockRepository extends JpaRepository<PhaseStock, Long> {
    List<PhaseStock> findByProjectIdAndReportDate(Long projectId, LocalDate reportDate);
    List<PhaseStock> findByPhaseId(Long phaseId);
}
