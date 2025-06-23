package htmp.codien.quanlycodien.repository;

import htmp.codien.quanlycodien.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByPhaseId(Long phaseId);
}
