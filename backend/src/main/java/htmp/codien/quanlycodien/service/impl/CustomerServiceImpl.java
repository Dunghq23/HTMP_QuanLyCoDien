package htmp.codien.quanlycodien.service.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import htmp.codien.quanlycodien.dto.CustomerDTO;
import htmp.codien.quanlycodien.exception.ResourceNotFoundException;
import htmp.codien.quanlycodien.model.Customer;
import htmp.codien.quanlycodien.repository.CustomerRepository;
import htmp.codien.quanlycodien.repository.ModelRepository;
import htmp.codien.quanlycodien.service.CustomerService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final ModelRepository modelRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<CustomerDTO> getAll() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
                .map(customer -> modelMapper.map(customer, CustomerDTO.class))
                .toList();
    }

    @Override
    public CustomerDTO getById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng"));
        return modelMapper.map(customer, CustomerDTO.class);
    }

    @Override
    public CustomerDTO create(CustomerDTO dto) {
        Customer customer = modelMapper.map(dto, Customer.class);
        customerRepository.save(customer);
        return dto;
    }

    @Override
    public CustomerDTO update(Long id, CustomerDTO dto) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng để cập nhật"));

        // Cập nhật các thuộc tính cần thiết
        existingCustomer.setName(dto.getName());

        customerRepository.save(existingCustomer);
        return modelMapper.map(existingCustomer, CustomerDTO.class);
    }

    @Override
    public void delete(Long id) {
        // Kiểm tra khách hàng có dự án nào không
        if (modelRepository.countByCustomerId(id) > 0) {
            throw new IllegalStateException("Không thể xóa khách hàng đã có dự án");
        }
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng để xóa"));
        customerRepository.delete(customer);
    }

}
