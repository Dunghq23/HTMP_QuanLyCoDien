package htmp.codien.quanlycodien.repository;

import htmp.codien.quanlycodien.model.TaskAssignment;
import htmp.codien.quanlycodien.model.TaskEmployeeId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, TaskEmployeeId> {
    List<TaskAssignment> findByEmployeeId(Long employeeId);
    List<TaskAssignment> findByTaskId(Long taskId);
}
