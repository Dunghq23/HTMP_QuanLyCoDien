package htmp.codien.quanlycodien.service;

import org.springframework.web.multipart.MultipartFile;

import htmp.codien.quanlycodien.dto.HandoverMinutesRequest;

public interface ProductService {
    void updateProductImage(Long productId, MultipartFile file);

    byte[] generateHandoverPDF(HandoverMinutesRequest request);

}
