package htmp.codien.quanlycodien.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import htmp.codien.quanlycodien.dto.HandoverMinutesRequest;
import htmp.codien.quanlycodien.dto.ProductStatusDTO;
import htmp.codien.quanlycodien.dto.ProductSummaryDTO;
import htmp.codien.quanlycodien.dto.ProductTestByEmployeeResponse;
import htmp.codien.quanlycodien.dto.StageQuantitySummaryResponse;

public interface ProductService {
    void updateProductImage(Long productId, MultipartFile file);

    byte[] generateHandoverPDF(HandoverMinutesRequest request);

    List<ProductStatusDTO> getProductStatuses();

    ProductSummaryDTO getProductSummary(LocalDate date, Integer week, Integer month, Integer year);

    StageQuantitySummaryResponse getQuantityProductByStagesIsBeingDone();
        List<ProductTestByEmployeeResponse> getProductTestSummaryByEmployee(LocalDate startDate, LocalDate endDate);

}