package htmp.codien.quanlycodien.model;

import java.time.LocalDate;

import htmp.codien.quanlycodien.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "processes_stage")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProcessStage  extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false)
    Process process;

    @Column(name = "name", length = 255, nullable = false)
    String name;

    @Column(name = "completion_date", length = 50, nullable = true)
    LocalDate completionDate;

    @Column(name = "description", nullable = true, columnDefinition = "TEXT")
    String description;
}