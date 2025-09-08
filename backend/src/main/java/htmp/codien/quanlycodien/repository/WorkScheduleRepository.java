package htmp.codien.quanlycodien.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import htmp.codien.quanlycodien.model.WorkSchedule;

public interface WorkScheduleRepository extends JpaRepository<WorkSchedule, Long> {
  @Query(value = """
          SELECT e.id, e.name, e.code, ws.work_date, ws.shift_id, s.shift_code
          FROM work_schedules ws
          JOIN employees e ON ws.employee_id = e.id
          JOIN shifts s ON s.id = ws.shift_id
          WHERE e.department_id = :departmentId
            AND ws.work_date BETWEEN :startDate AND :endDate
      """, nativeQuery = true)
  List<Object[]> findWorkSchedulesByDepartmentAndDate(
      @Param("departmentId") Long departmentId,
      @Param("startDate") LocalDate startDate,
      @Param("endDate") LocalDate endDate);

  @Query(value = """
          SELECT e.id, e.name, e.code, ws.work_date, ws.shift_id, s.shift_code
          FROM work_schedules ws
          JOIN employees e ON ws.employee_id = e.id
          JOIN shifts s ON s.id = ws.shift_id
          WHERE ws.employee_id = :employeeId
            AND ws.work_date BETWEEN :startDate AND :endDate
      """, nativeQuery = true)
  List<Object[]> findWorkSchedulesByEmployeeAndDate(
      @Param("employeeId") Long employeeId,
      @Param("startDate") LocalDate startDate,
      @Param("endDate") LocalDate endDate);

  @Query(value = """
      SELECT s.start_time, s.end_time, s.id, shift_code
      FROM work_schedules ws
      JOIN shifts s ON ws.shift_id = s.id
      WHERE ws.work_date = :workDate
        AND ws.employee_id = :employeeId
      """, nativeQuery = true)
  List<Object[]> findShiftTimesByEmployeeAndDate(
      @Param("employeeId") Long employeeId,
      @Param("workDate") LocalDate workDate);

  void deleteByWorkDateBetweenAndEmployee_Department_Id(LocalDate start, LocalDate end, Long currentDepartmentId);
}