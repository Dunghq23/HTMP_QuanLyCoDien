package htmp.codien.quanlycodien.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import htmp.codien.quanlycodien.model.Model;
import htmp.codien.quanlycodien.model.Product;
import jakarta.transaction.Transactional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByModel(Model model);

    List<Product> findByCode(String productCode);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.image = :fileName WHERE p.id = :productId")
    void updateProductImage(Long productId, String fileName);

    @Query(value = """
            SELECT
                pd.code AS code,
                pd.name AS name,
                pd.mold_code AS moldCode,
                e.name AS employee,
                p.type AS type,
                CASE
                    WHEN p.type = 'JIG' THEN
                        CASE
                            WHEN thietke.completion_date IS NULL THEN 'Đang thiết kế'
                            WHEN thietke.completion_date IS NOT NULL AND muahang.completion_date IS NULL THEN 'Đang mua hàng'
                            WHEN muahang.completion_date IS NOT NULL AND giacong.completion_date IS NULL THEN 'Đang gia công'
                            WHEN giacong.completion_date IS NOT NULL AND laprap.completion_date IS NULL THEN 'Đang lắp ráp'
                            WHEN laprap.completion_date IS NOT NULL AND thunghiem.completion_date IS NULL THEN 'Đang thử nghiệm'
                            WHEN thunghiem.completion_date IS NOT NULL AND bangiao.completion_date IS NULL THEN 'Đang bàn giao'
                            ELSE 'Hoàn thành'
                        END
                    ELSE
                        CASE
                            WHEN thietke.completion_date IS NULL THEN 'Đang thiết kế'
                            WHEN thietke.completion_date IS NOT NULL AND muahang.completion_date IS NULL THEN 'Đang mua hàng'
                            WHEN muahang.completion_date IS NOT NULL AND giacong.completion_date IS NULL THEN 'Đang gia công'
                            WHEN giacong.completion_date IS NOT NULL AND laprap.completion_date IS NULL THEN 'Đang lắp ráp'
                            WHEN laprap.completion_date IS NOT NULL AND bangiao.completion_date IS NULL THEN 'Đang bàn giao'
                            WHEN bangiao.completion_date IS NOT NULL AND thunghiem.completion_date IS NULL THEN 'Đang thử nghiệm'
                            ELSE 'Hoàn thành'
                        END
                END AS currentStatus
            FROM products pd
            JOIN processes p ON pd.id = p.product_id
            JOIN employees e ON e.id = p.employee_id
            LEFT JOIN processes_stage thietke  ON thietke.process_id = p.id AND thietke.name = 'Thiết kế'
            LEFT JOIN processes_stage muahang  ON muahang.process_id = p.id AND muahang.name = 'Mua hàng'
            LEFT JOIN processes_stage giacong  ON giacong.process_id = p.id AND giacong.name = 'Gia công'
            LEFT JOIN processes_stage laprap   ON laprap.process_id = p.id AND laprap.name = 'Lắp ráp'
            LEFT JOIN processes_stage thunghiem ON thunghiem.process_id = p.id AND thunghiem.name = 'Thử nghiệm'
            LEFT JOIN processes_stage bangiao  ON bangiao.process_id = p.id AND bangiao.name = 'Bàn giao'
            """, nativeQuery = true)
    List<Object[]> findProductStatuses();

    @Query(value = """
        WITH phase_list AS (
            SELECT 'Chưa thiết kế' AS phase_name
            UNION ALL SELECT 'Thiết kế'
            UNION ALL SELECT 'Mua hàng'
            UNION ALL SELECT 'Gia công'
            UNION ALL SELECT 'Lắp ráp'
            UNION ALL SELECT 'Bàn giao'
            UNION ALL SELECT 'Thử nghiệm'
        ),
        types AS (
            SELECT DISTINCT type FROM processes
        ),
        status_count AS (
            -- Đếm số lượng từng giai đoạn
            SELECT
                CASE
                    WHEN ps.name = 'Thiết kế' AND ps.completion_date IS NULL THEN 'Chưa thiết kế'
                    ELSE ps.name
                END AS phase_name,
                p.type,
                COUNT(*) AS total
            FROM processes_stage ps
            JOIN processes p ON ps.process_id = p.id
            JOIN products pd ON pd.id = p.product_id
            WHERE (
                (ps.name = 'Thiết kế' AND ps.completion_date IS NULL)
                OR (ps.completion_date BETWEEN :startDate AND :endDate)
            )
            GROUP BY
                CASE
                    WHEN ps.name = 'Thiết kế' AND ps.completion_date IS NULL THEN 'Chưa thiết kế'
                    ELSE ps.name
                END,
                p.type
        )
        SELECT
            t.type,
            pl.phase_name,
            COALESCE(sc.total, 0) AS total
        FROM types t
        CROSS JOIN phase_list pl
        LEFT JOIN status_count sc
            ON sc.type = t.type
            AND sc.phase_name = pl.phase_name
        """, nativeQuery = true)
    List<Object[]> countProductByPhaseAndType(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

}