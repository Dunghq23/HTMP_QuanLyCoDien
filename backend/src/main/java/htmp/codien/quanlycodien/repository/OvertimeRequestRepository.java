package htmp.codien.quanlycodien.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import htmp.codien.quanlycodien.model.OvertimeRequest;

@Repository
public interface OvertimeRequestRepository extends JpaRepository<OvertimeRequest, Long> {

}