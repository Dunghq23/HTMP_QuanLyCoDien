package htmp.codien.quanlycodien.service.impl;

import htmp.codien.quanlycodien.dto.NewModelDTO;
import htmp.codien.quanlycodien.dto.ProductDTO;
import htmp.codien.quanlycodien.exception.ConflictException;
import htmp.codien.quanlycodien.exception.ResourceNotFoundException;
import htmp.codien.quanlycodien.model.Customer;
import htmp.codien.quanlycodien.model.Model;
import htmp.codien.quanlycodien.model.Product;
import htmp.codien.quanlycodien.repository.CustomerRepository;
import htmp.codien.quanlycodien.repository.ModelRepository;
import htmp.codien.quanlycodien.repository.ProductRepository;
import htmp.codien.quanlycodien.service.ModelService;
import htmp.codien.quanlycodien.utils.ExcelUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModelServiceImpl implements ModelService {

    private final ModelRepository modelRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public void createOrderFromExcel(Long customerId, MultipartFile file) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng"));
        try (XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream())) {
            // Parse model and product list
            Model newModel = parseModelFromExcel(workbook);
            List<Product> products = parseProductsFromExcel(workbook);

            if (products.isEmpty()) {
                throw new IllegalArgumentException("Không có sản phẩm nào trong file Excel");
            }

            // ✅ Kiểm tra xem model có code trùng chưa
            Optional<Model> existing = modelRepository.findByCode(newModel.getCode());
            if (existing.isPresent()) {
                throw new ConflictException("Model với mã '" + newModel.getCode() + "' đã tồn tại");
            }

            newModel.setCustomer(customer);
            // Gán quan hệ nếu Product có @ManyToOne Model
            products.forEach(product -> product.setModel(newModel));

            modelRepository.save(newModel);
            productRepository.saveAll(products);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi đọc file Excel", e);
        }
    }

    private Model parseModelFromExcel(XSSFWorkbook workbook) {
        Model model = new Model();
        XSSFSheet sheet = workbook.getSheetAt(0);
        Row row = sheet.getRow(0);
        if (row != null) {
            model.setCode(ExcelUtils.getCellString(row, 1)); // cột B
            model.setName(ExcelUtils.getCellString(row, 3)); // cột D
        }
        return model;
    }

    private List<Product> parseProductsFromExcel(XSSFWorkbook workbook) {
        List<Product> products = new ArrayList<>();
        XSSFSheet sheet = workbook.getSheetAt(0);

        for (int i = 2; i <= sheet.getLastRowNum(); i++) { // bắt đầu từ dòng 3
            Row row = sheet.getRow(i);
            if (row == null || row.getCell(0) == null || row.getCell(0).toString().trim().isEmpty()) {
                continue;
            }

            Product product = new Product();
            product.setCode(ExcelUtils.getCellString(row, 0)); // cột A
            product.setName(ExcelUtils.getCellString(row, 1)); // cột B
            product.setMoldCode(ExcelUtils.getCellString(row, 2)); // cột C
            product.setGateType(ExcelUtils.getCellString(row, 3)); // cột D

            products.add(product);
        }

        return products;
    }

    @Override
    public List<NewModelDTO> findAll() {
        List<Model> modelList = modelRepository.findAll();
        List<NewModelDTO> newModelDTOs = new ArrayList<>();

        for (Model model : modelList) {
            NewModelDTO newModelDTO = modelMapper.map(model, NewModelDTO.class);
            Customer customer = model.getCustomer();
            newModelDTO.setCustomerName(customer.getName());
            newModelDTOs.add(newModelDTO);
        }
        return newModelDTOs;
    }

    @Override
    public List<ProductDTO> getAllProductByModel(Long modelId) {
        Model model = modelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("Model không tồn tại"));
        List<Product> products = productRepository.findByModel(model);

        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteModel(Long id) {
        modelRepository.deleteById(id);
    }

    @Override
    public List<NewModelDTO> searchByProductCodeOrMoldCode(String keyword) {
        List<NewModelDTO> models = modelRepository.findByProductCodeOrMoldCode(keyword);
        if (models == null || models.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy model với mã sản phẩm hoặc mã khuôn");
        }
        return models;
    }
}
