package htmp.codien.quanlycodien.service.impl;

import htmp.codien.quanlycodien.dto.DailyWorkReportDTO;
import htmp.codien.quanlycodien.model.DailyWorkReport;
import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.repository.DailyWorkReportRepository;
import htmp.codien.quanlycodien.service.DailyWorkReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DailyWorkReportServiceImpl implements DailyWorkReportService {

    @Autowired
    private DailyWorkReportRepository reportRepository;

    @Override
    public List<DailyWorkReportDTO> getAllReports() {
        return reportRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private DailyWorkReportDTO toDTO(DailyWorkReport report) {
        Employee emp = report.getEmployee();
        return DailyWorkReportDTO.builder()
                .id(report.getId())
                .reportDate(report.getReportDate())
                .taskDescription(report.getTaskDescription())
                .startTime(report.getStartTime())
                .endTime(report.getEndTime())
                .filePath(report.getFilePath())
                .employeeId(emp != null ? emp.getId() : null)
                .employeeCode(emp != null ? emp.getCode() : null)
                .employeeName(emp != null ? emp.getName() : null)
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }

}
