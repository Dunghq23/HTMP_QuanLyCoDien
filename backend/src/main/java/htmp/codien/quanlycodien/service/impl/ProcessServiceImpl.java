package htmp.codien.quanlycodien.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import htmp.codien.quanlycodien.dto.JigDetailDTO;
import htmp.codien.quanlycodien.dto.ProcessDTO;
import htmp.codien.quanlycodien.dto.ProcessStageDTO;
import htmp.codien.quanlycodien.exception.ResourceNotFoundException;
import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.model.JigDetail;
import htmp.codien.quanlycodien.model.Process;
import htmp.codien.quanlycodien.model.ProcessStage;
import htmp.codien.quanlycodien.model.Product;
import htmp.codien.quanlycodien.repository.EmployeeRepository;
import htmp.codien.quanlycodien.repository.JigDetailRepository;
import htmp.codien.quanlycodien.repository.ProcessRepository;
import htmp.codien.quanlycodien.repository.ProcessStageRepository;
import htmp.codien.quanlycodien.repository.ProductRepository;
import htmp.codien.quanlycodien.service.ProcessService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProcessServiceImpl implements ProcessService {
        private final ProcessRepository processRepository;
        private final ProductRepository productRepository;
        private final EmployeeRepository employeeRepository;
        private final ProcessStageRepository processStageRepository;
        private final JigDetailRepository jigDetailRepository;
        private final ModelMapper modelMapper;

        @Override
        public void createProcess(Long productId, Long employeeId, String type, String name, String erpCode,
                        String jigName) {

                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
                Employee employee = employeeRepository.findById(employeeId)
                                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên"));

                Process process = Process.builder()
                                .name(name)
                                .product(product)
                                .employee(employee)
                                .type(type)
                                .name(name)
                                .cost(0.0)
                                .build();

                Process savedProcess = processRepository.save(process);

                if (type.equals("JIG")) {
                        JigDetail jigDetail = JigDetail.builder()
                                        .name(jigName)
                                        .erpCode(erpCode)
                                        .process(savedProcess)
                                        .build();
                        jigDetailRepository.save(jigDetail);
                }

                List<String> processNames;

                if (type.equals("JIG")) {
                        processNames = List.of("Thiết kế", "Mua hàng", "Gia công", "Lắp ráp", "Thử nghiệm", "Bàn giao");
                } else {
                        processNames = List.of("Thiết kế", "Mua hàng", "Gia công", "Lắp ráp", "Bàn giao", "Thử nghiệm");
                }

                for (String processName : processNames) {
                        ProcessStage processStage = ProcessStage.builder()
                                        .name(processName)
                                        .process(savedProcess)
                                        .build();
                        processStageRepository.save(processStage);
                }
        }

        @Override
        public List<ProcessDTO> getAllProcessByProductId(Long productId) {
                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

                List<Process> processes = processRepository.findByProduct(product);

                if (processes.isEmpty()) {
                        throw new ResourceNotFoundException(
                                        "Không tìm thấy công đoạn cho sản phẩm có ID: " + productId);
                }

                List<ProcessDTO> processDTOs = new ArrayList<>();
                for (Process process : processes) {
                        List<ProcessStage> processStages = processStageRepository.findAllByProcess(process);
                        List<ProcessStageDTO> processStageDTOs = new ArrayList<>();
                        for (ProcessStage stage : processStages) {
                                ProcessStageDTO stageDTO = ProcessStageDTO.builder()
                                                .id(stage.getId())
                                                .name(stage.getName())
                                                .completionDate(stage.getCompletionDate())
                                                .description(stage.getDescription())
                                                .build();
                                processStageDTOs.add(stageDTO);
                        }
                        JigDetailDTO jigDetailDTO = jigDetailRepository.findByProcess(process)
                                        .map(jig -> modelMapper.map(jig, JigDetailDTO.class))
                                        .orElse(null);
                        ProcessDTO processDTO = ProcessDTO.builder()
                                        .id(process.getId())
                                        .employeeName(process.getEmployee().getName())
                                        .type(process.getType())
                                        .name(process.getName())
                                        .cost(process.getCost())
                                        .jigDetail(jigDetailDTO)
                                        .processStageList(processStageDTOs)
                                        .build();
                        processDTOs.add(processDTO);
                }

                return processDTOs;
        }

        @Override
        public void updateProcessStage(Long id, LocalDate date, String description) {
                ProcessStage processStage = processStageRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Không tìm thấy công đoạn với ID: " + id));

                if (date != null) {
                        processStage.setCompletionDate(date);
                }
                if (description != null) {
                        processStage.setDescription(description);
                }
                processStageRepository.save(processStage);
        }

        @Override
        public void updateProcess(Long processId, Double cost) {
                Process process = processRepository.findById(processId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Không tìm thấy công đoạn với ID: " + processId));

                process.setCost(cost);
                processRepository.save(process);
        }

        @Override
        public void deleteProcess(Long processId) {
                Process process = processRepository.findById(processId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Không tìm thấy công đoạn với ID: " + processId));

                processRepository.delete(process);
        }
}