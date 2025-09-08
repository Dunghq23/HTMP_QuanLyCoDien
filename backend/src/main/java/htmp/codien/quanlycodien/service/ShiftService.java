package htmp.codien.quanlycodien.service;

import java.util.List;

import htmp.codien.quanlycodien.dto.schedule.ShiftDTO;

public interface ShiftService {
    List<ShiftDTO> getAllShifts();
    ShiftDTO getShiftById(Long id);
    void addShift(ShiftDTO shiftDTO);
    void updateShift(Long id, ShiftDTO shiftDTO);
    void deleteShift(Long id);
}