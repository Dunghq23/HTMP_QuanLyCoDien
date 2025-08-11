package htmp.codien.quanlycodien.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import htmp.codien.quanlycodien.dto.newModel.OrderItemUpdateDTO;
import htmp.codien.quanlycodien.dto.order.OrderDTO;
import htmp.codien.quanlycodien.dto.order.OrderItemDTO;

public interface OrderService {
    List<OrderDTO> findAll();

    void createOrderFromExcel(String documentNumber, Long EmployeeId, LocalDate orderDate, String note,
            MultipartFile file);

    List<OrderItemDTO> getAllOrderItem(Long orderId);

    void updateOrderItem(Long itemId, OrderItemUpdateDTO orderItemUpdateDTO);

    List<OrderDTO> getOrderByMaterialCode(String materialCode);
}