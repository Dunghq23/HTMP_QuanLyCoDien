package htmp.codien.quanlycodien.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    // Mối quan hệ: Nhiều model thuộc về 1 khách hàng
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = false)
    Model model;

    @Column(name = "code", length = 50, nullable = false)
    String code;

    @Column(name = "name", length = 255, nullable = false)
    String name;

    @Column(name = "mold_code", length = 50, nullable = false)
    String moldCode;

    @Column(name = "gate_type", length = 50, nullable = false)
    String gateType;

    @Column(name = "image", length = 255, nullable = true)
    String image;
}