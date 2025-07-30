package htmp.codien.quanlycodien.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import htmp.codien.quanlycodien.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "document_number", length = 255, nullable = false)
    String documentNumber;

    // Mối quan hệ: Nhiều đơn hàng thuộc về 1 nhân viên
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    Employee employee;

    @Column(name = "order_date", length = 100, nullable = false)
    LocalDate orderDate;

    @Column(name = "status", length = 20, unique = true, nullable = false)
    String status;

    @Column(name = "note", length = 255, nullable = false)
    String note;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("order") // Để tránh vòng lặp khi serialize
    List<OrderItem> orderItems;
}