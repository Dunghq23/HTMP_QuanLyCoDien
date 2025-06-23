package htmp.codien.quanlycodien.repository;

import htmp.codien.quanlycodien.model.DailyWorkReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyWorkReportRepository extends JpaRepository<DailyWorkReport, Long> {
    
}