package htmp.codien.quanlycodien.controller;

import htmp.codien.quanlycodien.common.ApiResponse;
import htmp.codien.quanlycodien.common.ResponseUtil;
import htmp.codien.quanlycodien.dto.NewModelDTO;
import htmp.codien.quanlycodien.dto.ProductDTO;
import htmp.codien.quanlycodien.service.ModelService;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/models")
@RequiredArgsConstructor
public class ModelController {
    private final ModelService modelService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NewModelDTO>>> getAllModel() {
        List<NewModelDTO> newModelDTOs = modelService.findAll();
        return ResponseUtil.success(newModelDTOs, "Lấy danh sách new model thành công");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getAllProductByModel(
            @PathVariable("id") Long modelId) {
        List<ProductDTO> orderItemDTOs = modelService.getAllProductByModel(modelId);
        return ResponseUtil.success(orderItemDTOs, "Lấy danh sách sản phẩm thành công");
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<NewModelDTO>>> searchByProductCodeOrMoldCode(
            @RequestParam("keyword") String keyword) {
        List<NewModelDTO> newModelDTOs = modelService.searchByProductCodeOrMoldCode(keyword);
        return ResponseUtil.success(newModelDTOs, "Tìm kiếm model thành công");
    }

    // POST create order from Excel file
    @PostMapping("/create-from-excel")
    public ResponseEntity<ApiResponse<Void>> createOrderFromExcel(
            @RequestParam Long customerId,
            @RequestPart("file") MultipartFile file) {
        modelService.createOrderFromExcel(customerId, file);
        return ResponseUtil.success(null, "Tạo đơn hàng từ Excel thành công");
    }

    @GetMapping("/template")
    public ResponseEntity<ClassPathResource> downloadTemplate() throws IOException {
        ClassPathResource resource = new ClassPathResource("templates/new-model-template.xlsx");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=new-model-template.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteModel(@PathVariable Long id) {
        modelService.deleteModel(id);
        return ResponseUtil.success(null, "Xóa model thành công");
    }

}