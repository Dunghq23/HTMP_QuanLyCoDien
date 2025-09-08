package htmp.codien.quanlycodien.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import htmp.codien.quanlycodien.model.OvertimeApproval;

@Repository
public interface OvertimeApprovalRepository extends JpaRepository<OvertimeApproval, Long> {

}