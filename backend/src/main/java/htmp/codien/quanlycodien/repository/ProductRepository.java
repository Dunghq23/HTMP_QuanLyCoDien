package htmp.codien.quanlycodien.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
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
}