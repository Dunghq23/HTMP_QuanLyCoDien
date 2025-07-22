package htmp.codien.quanlycodien.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import htmp.codien.quanlycodien.dto.NewModelDTO;
import htmp.codien.quanlycodien.model.Model;

@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {
    @Query(value = """
                SELECT m.id, m.code, m.name, c.name as customerName
                FROM models m
                JOIN products p ON m.id = p.model_id 
                JOIN customers AS c ON m.customer_id = c.id
                WHERE p.mold_code LIKE CONCAT('%', :keyword, '%')
                   OR p.code LIKE CONCAT('%', :keyword, '%')
            """, nativeQuery = true)
    List<NewModelDTO> findByProductCodeOrMoldCode(@Param("keyword") String keyword);
}
