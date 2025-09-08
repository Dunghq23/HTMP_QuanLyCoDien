package htmp.codien.quanlycodien.service;

import java.util.List;

import htmp.codien.quanlycodien.dto.schedule.ShiftBreakDTO;

public interface ShiftBreakService {
    List<ShiftBreakDTO> getAllShiftBreaks();

    ShiftBreakDTO getShiftBreakById(Long id);

    void createShiftBreak(ShiftBreakDTO shiftBreak);

    void updateShiftBreak(Long id, ShiftBreakDTO shiftBreak);

    void deleteShiftBreak(Long id);

    List<ShiftBreakDTO> getAllShiftBreaksByShiftId(Long shiftId);
}