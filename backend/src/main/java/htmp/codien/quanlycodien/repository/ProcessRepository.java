package htmp.codien.quanlycodien.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import htmp.codien.quanlycodien.model.Process;
import htmp.codien.quanlycodien.model.Product;

@Repository
public interface ProcessRepository extends JpaRepository<Process, Long> {

    List<Process> findByProduct(Product product);
}
