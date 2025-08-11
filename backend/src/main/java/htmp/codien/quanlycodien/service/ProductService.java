package htmp.codien.quanlycodien.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import htmp.codien.quanlycodien.dto.newModel.HandoverMinutesRequest;
import htmp.codien.quanlycodien.dto.newModel.ProductStatusDTO;
import htmp.codien.quanlycodien.dto.newModel.ProductSummaryDTO;
import htmp.codien.quanlycodien.dto.newModel.ProductTestByEmployeeResponse;
import htmp.codien.quanlycodien.dto.newModel.StageQuantitySummaryResponse;

public interface ProductService {
    void updateProductImage(Long productId, MultipartFile file);

    byte[] generateHandoverPDF(HandoverMinutesRequest request);

    List<ProductStatusDTO> getProductStatuses();

    ProductSummaryDTO getProductSummary(LocalDate date, Integer week, Integer month, Integer year);

    StageQuantitySummaryResponse getQuantityProductByStagesIsBeingDone();
        List<ProductTestByEmployeeResponse> getProductTestSummaryByEmployee(LocalDate startDate, LocalDate endDate);

}