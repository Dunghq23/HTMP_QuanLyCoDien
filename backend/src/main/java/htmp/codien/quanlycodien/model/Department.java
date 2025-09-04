package htmp.codien.quanlycodien.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import htmp.codien.quanlycodien.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Table(name = "departments")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Department extends BaseEntity {
    @Column(name = "name", length = 100, nullable = false)
    String name;

    @Column(name = "code", length = 20, nullable = false)
    String code;

    // Liên kết đến phòng ban cha (self-references)
    @ManyToOne
    @JoinColumn(name = "parent_department_id") // Khóa ngoại trỏ đến chính bảng departments
    @JsonBackReference // Ngăn vòng lặp khi serialize JSON
    Department parentDepartment;

    // Liên kết đến danh sách phòng ban con
    @OneToMany(mappedBy = "parentDepartment")
    @JsonManagedReference // Quản lý serialize JSON ngược lại
    @Builder.Default
    List<Department> subDepartments = new ArrayList<>();

    @OneToMany(mappedBy = "department")
    @Builder.Default
    List<Employee> employees = new ArrayList<>();
}