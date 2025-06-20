package htmp.codien.quanlycodien.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "employees")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "phase_id", nullable = false) // liên kết với bảng projects
    Phase phase;
    
    @Column(name = "name")
    String name;

    @Column(name = "start_date")
    LocalDate startDate;

    @Column(name = "end_date")
    LocalDate endDate;

    @Column(name = "progress")
    Double progress;
    
    @Column(name = "text")
    String text;
    
    @OneToMany(mappedBy = "task")
    List<TaskAssignment> assignments;
}
