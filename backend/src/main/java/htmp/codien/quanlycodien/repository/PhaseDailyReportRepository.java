package htmp.codien.quanlycodien.repository;

import htmp.codien.quanlycodien.model.PhaseDailyReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PhaseDailyReportRepository extends JpaRepository<PhaseDailyReport, Long> {
    List<PhaseDailyReport> findByProjectIdAndReportDate(Long projectId, LocalDate reportDate);
    List<PhaseDailyReport> findByPhaseIdAndReportDateBetween(Long phaseId, LocalDate start, LocalDate end);
}
