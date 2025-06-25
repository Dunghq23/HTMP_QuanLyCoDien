package htmp.codien.quanlycodien.repository;

import htmp.codien.quanlycodien.model.DailyWorkReport;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyWorkReportRepository extends JpaRepository<DailyWorkReport, Long> {
    List<DailyWorkReport> findByReportDate(LocalDate date);
    List<DailyWorkReport> findByEmployeeIdAndReportDate(Long employeeId, LocalDate date);
}