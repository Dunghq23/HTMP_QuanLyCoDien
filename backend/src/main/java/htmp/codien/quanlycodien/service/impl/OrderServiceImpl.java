package htmp.codien.quanlycodien.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import htmp.codien.quanlycodien.dto.OrderDTO;
import htmp.codien.quanlycodien.dto.OrderItemDTO;
import htmp.codien.quanlycodien.dto.OrderItemUpdateDTO;
import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.model.Order;
import htmp.codien.quanlycodien.model.OrderItem;
import htmp.codien.quanlycodien.repository.EmployeeRepository;
import htmp.codien.quanlycodien.repository.OrderItemRepository;
import htmp.codien.quanlycodien.repository.OrderRepository;
import htmp.codien.quanlycodien.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final EmployeeRepository employeeRepository;
    private final ModelMapper modelMapper;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public List<OrderDTO> findAll() {

        List<Order> orders = orderRepository.findAll();
        List<OrderDTO> orderDTOs = new ArrayList<>();
        for (Order order : orders) {
            OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
            orderDTO.setEmployeeId(orderDTO.getEmployeeId());
            Employee employee = employeeRepository.findById(order.getEmployee().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Employee not found with ID: " + order.getEmployee().getId()));
            orderDTO.setEmployeeName(employee.getName());
            orderDTOs.add(orderDTO);
        }
        return orderDTOs;
    }

    @Override
    public List<OrderItemDTO> getAllOrderItem(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));
        return orderItemRepository.findByOrder(order)
                .stream()
                .map(item -> modelMapper.map(item, OrderItemDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void createOrderFromExcel(String documentNumber, Long EmployeeId, LocalDate orderDate, String note,
            MultipartFile file) {
        List<OrderItemDTO> orderItems = new ArrayList<>();
        try {
            orderItems = parseOrderItemsFromExcel(file.getInputStream());
            if (orderItems.isEmpty()) {
                throw new IllegalArgumentException("No order items found in the uploaded file.");
            }

            // 1. Tạo đơn hàng mới
            Order order = new Order();
            order.setDocumentNumber(documentNumber);
            order.setEmployee(employeeRepository.findById(EmployeeId)
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + EmployeeId)));
            order.setOrderDate(orderDate);
            order.setStatus("PENDING"); // Trạng thái mặc định
            order.setNote(note);
            order = orderRepository.save(order);

            // 2. Chuyển đổi OrderItemDTO sang OrderItem và lưu vào cơ sở dữ liệu
            for (OrderItemDTO itemDTO : orderItems) {
                OrderItem item = modelMapper.map(itemDTO, OrderItem.class);
                item.setOrder(order); // Thiết lập quan hệ với đơn hàng
                orderItemRepository.save(item);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    private List<OrderItemDTO> parseOrderItemsFromExcel(InputStream inputStream) throws IOException {
        List<OrderItemDTO> orderItems = new ArrayList<>();

        try (XSSFWorkbook workbook = new XSSFWorkbook(inputStream)) {
            XSSFSheet sheet = workbook.getSheetAt(0); // Lấy sheet đầu tiên

            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // Bỏ qua dòng tiêu đề
                Row row = sheet.getRow(i);
                if (row == null || row.getCell(0) == null || row.getCell(0).toString().trim().isEmpty())
                    continue;

                OrderItemDTO item = new OrderItemDTO();

                item.setMaterialCode(getCellString(row, 0));
                item.setMaterialName(getCellString(row, 1));
                item.setUnit(getCellString(row, 2));
                item.setQuantityOrdered(getCellDouble(row, 3));
                item.setPurpose(getCellString(row, 4));
                item.setNote(getCellString(row, 5));

                item.setQuantityReceived(0.0);

                orderItems.add(item);
            }
        }

        return orderItems;
    }

    private String getCellString(Row row, int index) {
        if (row.getCell(index) == null)
            return "";
        switch (row.getCell(index).getCellType()) {
            case STRING:
                return row.getCell(index).getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf(row.getCell(index).getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(row.getCell(index).getBooleanCellValue());
            case FORMULA:
                return row.getCell(index).getCellFormula();
            default:
                return "";
        }
    }

    private Double getCellDouble(Row row, int index) {
        if (row.getCell(index) == null)
            return 0.0;
        if (row.getCell(index).getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC) {
            return row.getCell(index).getNumericCellValue();
        } else if (row.getCell(index).getCellType() == org.apache.poi.ss.usermodel.CellType.STRING) {
            try {
                return Double.parseDouble(row.getCell(index).getStringCellValue());
            } catch (NumberFormatException e) {
                return 0.0;
            }
        }
        return 0.0;
    }

    @Override
    @Transactional
    public void updateOrderItem(Long itemId, OrderItemUpdateDTO orderItemUpdateDTO) {
        // 1. Cập nhật số lượng nhận
        OrderItem item = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order item"));

        if (orderItemUpdateDTO.getReceivedDate() != null) {
            item.setReceivedDate(orderItemUpdateDTO.getReceivedDate());
        }

        if (orderItemUpdateDTO.getQuantityReceived() != null) {
            item.setQuantityReceived(orderItemUpdateDTO.getQuantityReceived());
        }

        orderItemRepository.save(item);

        // 2. Kiểm tra toàn bộ order có còn item nào chưa nhận đủ không
        long notFullyReceivedCount = orderItemRepository.countItemsNotFullyReceivedByItemId(itemId);

        if (notFullyReceivedCount == 0) {
            // Tất cả item đã nhận đủ -> Cập nhật order thành DONE
            Order order = item.getOrder();
            if (!"DONE".equalsIgnoreCase(order.getStatus())) {
                order.setStatus("DONE");
                orderRepository.save(order);
            }
        } else {
            Order order = item.getOrder();
            order.setStatus("PENDING");
            orderRepository.save(order);
        }
    }

    @Override
    public List<OrderDTO> getOrderByMaterialCode(String materialCode) {
        List<OrderItem> orderItemList = orderItemRepository.findByMaterialCode(materialCode);
        Set<Long> orderIds = new HashSet<>();

        // Lấy ra tất cả orderId không trùng
        for (OrderItem orderItem : orderItemList) {
            if (orderItem.getOrder() != null && orderItem.getOrder().getId() != null) {
                orderIds.add(orderItem.getOrder().getId());
            }
        }

        // Truy vấn tất cả Order cùng lúc (tối ưu hơn query từng cái)
        List<Order> orders = orderRepository.findAllById(orderIds);

        // Chuyển sang DTO
        List<OrderDTO> orderDTOs = orders.stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());

        return orderDTOs;
    }
}