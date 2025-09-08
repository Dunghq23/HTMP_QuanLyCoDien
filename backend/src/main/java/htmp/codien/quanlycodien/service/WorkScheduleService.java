package htmp.codien.quanlycodien.service;

import java.io.ByteArrayInputStream;
import java.util.List;

import htmp.codien.quanlycodien.dto.schedule.EmployeeScheduleRequest;
import htmp.codien.quanlycodien.dto.schedule.EmployeeScheduleResponse;

public interface WorkScheduleService {
    void saveSchedulesOnce(List<EmployeeScheduleRequest> requests);

    List<EmployeeScheduleResponse> getWorkScheduleByDepartment(Long departmentId, String month, String year);

    EmployeeScheduleResponse getWorkScheduleByEmployee(Long employeeId, String month, String year);

    ByteArrayInputStream exportWorkSchedule(Long departmentId, int year, int month);
}