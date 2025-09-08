package htmp.codien.quanlycodien.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import htmp.codien.quanlycodien.model.ShiftBreak;

@Repository
public interface ShiftBreakRepository extends JpaRepository<ShiftBreak, Long> {
    List<ShiftBreak> findAllByShift_Id(Long shiftId);
}