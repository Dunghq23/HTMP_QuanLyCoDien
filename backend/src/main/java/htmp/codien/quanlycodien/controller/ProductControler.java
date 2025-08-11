package htmp.codien.quanlycodien.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import htmp.codien.quanlycodien.common.ApiResponse;
import htmp.codien.quanlycodien.common.ResponseUtil;
import htmp.codien.quanlycodien.dto.newModel.HandoverMinutesRequest;
import htmp.codien.quanlycodien.dto.newModel.ProductStatusDTO;
import htmp.codien.quanlycodien.dto.newModel.ProductSummaryDTO;
import htmp.codien.quanlycodien.dto.newModel.ProductTestByEmployeeResponse;
import htmp.codien.quanlycodien.dto.newModel.StageQuantitySummaryResponse;
import htmp.codien.quanlycodien.service.ProductService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductControler {
    private final ProductService productService;

    @PatchMapping("/{productId}/image")
    public ResponseEntity<ApiResponse<Void>> uploadProductImage(
            @PathVariable Long productId,
            @RequestPart("file") MultipartFile file) {
        productService.updateProductImage(productId, file);
        return ResponseUtil.success(null, "Cập nhật ảnh sản phẩm thành công");
    }

    @PostMapping("/handover")
    public ResponseEntity<byte[]> generatePDFHandover(@RequestBody HandoverMinutesRequest request) {
        byte[] pdfBytes = productService.generateHandoverPDF(request);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.builder("inline")
                .filename("Handover.pdf")
                .build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/statuses")
    public ResponseEntity<ApiResponse<List<ProductStatusDTO>>> getProductStatuses() {
        List<ProductStatusDTO> statuses = productService.getProductStatuses();
        return ResponseUtil.success(statuses, "Lấy danh sách tình trạng sản phẩm thành công");
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<ProductSummaryDTO>> getProductSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer week,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        ProductSummaryDTO summary = productService.getProductSummary(date, week, month, year);
        return ResponseUtil.success(summary, "Lấy báo cáo tổng hợp thành công");
    }

    @GetMapping("/summary-being-done")
    public ResponseEntity<ApiResponse<StageQuantitySummaryResponse>> getQuantityProductByStagesIsBeingDone() {

        StageQuantitySummaryResponse summary = productService.getQuantityProductByStagesIsBeingDone();
        return ResponseUtil.success(summary, "Lấy báo cáo tổng hợp thành công");
    }

    @GetMapping("/test-summary-by-employee")
    public ResponseEntity<ApiResponse<List<ProductTestByEmployeeResponse>>> getProductTestSummaryByEmployee(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<ProductTestByEmployeeResponse> summary = productService.getProductTestSummaryByEmployee(startDate,
                endDate);

        return ResponseUtil.success(summary, "Lấy báo cáo thử nghiệm theo nhân viên thành công");
    }

}