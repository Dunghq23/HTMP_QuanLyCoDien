package htmp.codien.quanlycodien.repository;

import htmp.codien.quanlycodien.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCustomerId(Long customerId);
}
