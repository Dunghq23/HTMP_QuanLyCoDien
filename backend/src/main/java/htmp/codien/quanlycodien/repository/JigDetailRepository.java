package htmp.codien.quanlycodien.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import htmp.codien.quanlycodien.model.JigDetail;
import htmp.codien.quanlycodien.model.Process;

@Repository
public interface JigDetailRepository extends JpaRepository<JigDetail, Long> {
    Optional<JigDetail> findByProcess(Process process);
}