package htmp.codien.quanlycodien.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import htmp.codien.quanlycodien.model.Model;

@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {

}
