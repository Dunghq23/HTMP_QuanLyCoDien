package htmp.codien.quanlycodien.model;

import java.util.ArrayList;
import java.util.List;

import htmp.codien.quanlycodien.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "processes")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Process extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    Employee employee;

    @Column(name = "type", length = 50, nullable = false)
    String type;

    @Column(name = "name", length = 255, nullable = false)
    String name;

    @Column(name = "cost", nullable = true)
    double cost;

    @OneToOne(mappedBy = "process", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY, optional = true)
    JigDetail jigDetail;

    @OneToMany(mappedBy = "process", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ProcessStage> stages = new ArrayList<>();
}