package htmp.codien.quanlycodien.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import htmp.codien.quanlycodien.model.Order;
import htmp.codien.quanlycodien.model.OrderItem;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder(Order order);

    List<OrderItem> findByMaterialCode(String materialCode);

    @Query(value = """
            SELECT COUNT(*)
            FROM order_items oi
            WHERE oi.order_id = (
                SELECT order_id
                FROM order_items
                WHERE id = :itemId
            )
            AND oi.quantity_received < oi.quantity_ordered
            """, nativeQuery = true)
    long countItemsNotFullyReceivedByItemId(@Param("itemId") Long itemId);
}