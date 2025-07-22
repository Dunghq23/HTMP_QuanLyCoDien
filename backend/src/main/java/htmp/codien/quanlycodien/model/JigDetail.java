package htmp.codien.quanlycodien.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "jig_details")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JigDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false)
    Process process;

    @Column(name = "name", length = 100, nullable = false)
    String name;

    @Column(name = "erp_code", length = 50, nullable = false)
    String erpCode;
}