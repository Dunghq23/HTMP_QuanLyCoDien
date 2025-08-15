package htmp.codien.quanlycodien.service.impl;

import java.util.List;
import java.util.Objects;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import htmp.codien.quanlycodien.dto.position.PositionDTO;
import htmp.codien.quanlycodien.exception.ConflictException;
import htmp.codien.quanlycodien.exception.ResourceNotFoundException;
import htmp.codien.quanlycodien.model.Position;
import htmp.codien.quanlycodien.repository.PositionRepository;
import htmp.codien.quanlycodien.service.PositionService;
import htmp.codien.quanlycodien.utils.StringUtils;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PositionServiceImpl implements PositionService {
    private final PositionRepository positionRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<PositionDTO> getAllPositions() {
        List<Position> positions = positionRepository.findAll();
        return positions.stream()
                .map(p -> modelMapper.map(p, PositionDTO.class))
                .toList();
    }

    @Override
    public PositionDTO getPositionById(Long id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chức vụ không tồn tại"));
        return modelMapper.map(position, PositionDTO.class);
    }

    @Override
    public void createPosition(PositionDTO positionDTO) {
        // Chuẩn hóa dữ liệu
        positionDTO.setCode(StringUtils.toUpperCase(positionDTO.getCode()));
        positionDTO.setName(StringUtils.capitalizeFirstLetterEachWord(positionDTO.getName()));

        // Check trùng
        if (positionRepository.existsByCode(positionDTO.getCode())) {
            throw new ConflictException("Mã chức vụ đã tồn tại");
        }
        if (positionRepository.existsByName(positionDTO.getName())) {
            throw new ConflictException("Tên chức vụ đã tồn tại");
        }

        Position position = modelMapper.map(positionDTO, Position.class);
        positionRepository.save(position);
    }

    @Override
    public void updatePosition(Long id, PositionDTO positionDTO) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chức vụ không tồn tại"));

        // Check trùng
        if (!Objects.equals(position.getCode(), positionDTO.getCode())
                && positionRepository.existsByCode(positionDTO.getCode())) {
            throw new ConflictException("Mã chức vụ đã tồn tại");
        }

        if (!Objects.equals(position.getName(), positionDTO.getName())
                && positionRepository.existsByName(positionDTO.getName())) {
            throw new ConflictException("Tên chức vụ đã tồn tại");
        }
        position.setCode(positionDTO.getCode());
        position.setName(positionDTO.getName());
        position.setLevel(positionDTO.getLevel());
        positionRepository.save(position);
    }

    @Override
    public void deletePosition(Long id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chức vụ không tồn tại"));
        positionRepository.delete(position);
    }
}