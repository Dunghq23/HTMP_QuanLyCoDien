package htmp.codien.quanlycodien.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import htmp.codien.quanlycodien.model.ShiftChangeApproval;

@Repository
public interface ShiftChangeApprovalRepository extends JpaRepository<ShiftChangeApproval, Long> {
    
}