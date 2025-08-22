package htmp.codien.quanlycodien.model;

import java.time.LocalDate;

import htmp.codien.quanlycodien.common.BaseEntity;
import htmp.codien.quanlycodien.model.enums.Role;
import htmp.codien.quanlycodien.model.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "shift_change_approvals")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShiftChangeApproval extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false, unique = true)
    ShiftChangeRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id", nullable = false)
    Employee approver;

    @Column(name = "role", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    Role role;

    @Column(name = "action", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    Status action;

    @Column(name = "action_date", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    LocalDate actionDate;

    @Column(name = "comment", columnDefinition = "TEXT")
    String comment;
}