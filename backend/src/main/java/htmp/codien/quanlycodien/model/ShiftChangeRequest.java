package htmp.codien.quanlycodien.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import htmp.codien.quanlycodien.common.BaseEntity;
import htmp.codien.quanlycodien.model.enums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "shift_change_requests")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShiftChangeRequest extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_shift_id", nullable = false)
    Shift currentShift;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_shift_id", nullable = false)
    Shift requestedShift;

    @Column(name = "work_date", nullable = false)
    LocalDate workDate;

    @Column(name = "reason", columnDefinition = "TEXT")
    String reason;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "status", nullable = false, length = 20)
    Status status = Status.PENDING_HEAD;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    Employee employee; 
}