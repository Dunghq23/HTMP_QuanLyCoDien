package htmp.codien.quanlycodien.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import htmp.codien.quanlycodien.dto.NewModelDTO;
import htmp.codien.quanlycodien.dto.ProductDTO;

public interface ModelService {
    void createOrderFromExcel(Long customerId, MultipartFile file);
    List<NewModelDTO> findAll();
    List<ProductDTO> getAllProductByModel(Long modelId);
    void deleteModel(Long id);
}