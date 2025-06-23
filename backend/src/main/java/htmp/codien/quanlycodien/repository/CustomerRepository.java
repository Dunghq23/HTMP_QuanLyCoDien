package htmp.codien.quanlycodien.repository;

import htmp.codien.quanlycodien.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
