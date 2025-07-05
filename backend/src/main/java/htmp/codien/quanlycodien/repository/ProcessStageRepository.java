package htmp.codien.quanlycodien.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import htmp.codien.quanlycodien.model.Process;
import htmp.codien.quanlycodien.model.ProcessStage;

@Repository
public interface ProcessStageRepository extends JpaRepository<ProcessStage, Long> {

    List<ProcessStage> findAllByProcess(Process process);
    
}
