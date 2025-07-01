package htmp.codien.quanlycodien.service;

import java.util.List;

import htmp.codien.quanlycodien.dto.CustomerDTO;

public interface CustomerService {
    List<CustomerDTO> getAll();
    CustomerDTO getById(Long id);
    CustomerDTO create(CustomerDTO dto);
    CustomerDTO update(Long id, CustomerDTO dto);
    void delete(Long id);
}
