package htmp.codien.quanlycodien.repository;

import htmp.codien.quanlycodien.model.DailyWorkReport;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyWorkReportRepository extends JpaRepository<DailyWorkReport, Long> {
    List<DailyWorkReport> findByReportDate(LocalDate date);

    @Query(value = """
            SELECT dwr.*
            FROM daily_work_reports dwr
            JOIN employees e ON dwr.employee_id = e.id
            JOIN departments d ON e.department_id = d.id
            LEFT JOIN departments parent_d ON d.parent_department_id = parent_d.id
            WHERE (parent_d.id = :departmentId OR d.id = :departmentId)
              AND dwr.report_date = :reportDate
            """, nativeQuery = true)
    List<DailyWorkReport> findReportsByDepartmentAndDate(
            @Param("departmentId") Long departmentId,
            @Param("reportDate") LocalDate reportDate);

    List<DailyWorkReport> findByEmployeeIdAndReportDate(Long employeeId, LocalDate date);
}