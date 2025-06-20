package htmp.codien.quanlycodien.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "phase_stocks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PhaseStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    Project project;

    @Column(name = "report_date", nullable = false)
    LocalDate reportDate;

    @Column(name = "phase_name", nullable = false, length = 100)
    String phaseName;

    @Column(name = "quantity")
    Integer quantity = 0;
}
