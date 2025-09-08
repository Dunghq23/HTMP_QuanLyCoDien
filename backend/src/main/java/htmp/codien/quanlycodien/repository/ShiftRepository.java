package htmp.codien.quanlycodien.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import htmp.codien.quanlycodien.model.Shift;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
    
}