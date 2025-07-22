package htmp.codien.quanlycodien.controller;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import htmp.codien.quanlycodien.common.ApiResponse;
import htmp.codien.quanlycodien.common.ResponseUtil;
import htmp.codien.quanlycodien.dto.HandoverMinutesRequest;
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

}
