package htmp.codien.quanlycodien.service;

import java.util.List;

import htmp.codien.quanlycodien.dto.position.PositionDTO;

public interface PositionService {

    List<PositionDTO> getAllPositions();

    PositionDTO getPositionById(Long id);

    void createPosition(PositionDTO positionDTO);

    void updatePosition(Long id, PositionDTO positionDTO);

    void deletePosition(Long id);
}