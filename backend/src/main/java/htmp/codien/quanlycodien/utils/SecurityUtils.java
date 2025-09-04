package htmp.codien.quanlycodien.utils;

import java.util.Collection;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import htmp.codien.quanlycodien.security.CustomUserDetails;
import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.model.Department;

public class SecurityUtils {

    public static Long getCurrentEmployeeId() {
        Employee employee = getCurrentEmployee();
        return employee != null ? employee.getId() : null;
    }

    public static Department getCurrentDepartment() {
        Employee employee = getCurrentEmployee();
        return employee != null ? employee.getDepartment() : null;
    }

    public static Long getCurrentDepartmentId() {
        Department dept = getCurrentDepartment();
        return dept != null ? dept.getId() : null;
    }

    public static String getCurrentDepartmentName() {
        Department dept = getCurrentDepartment();
        return dept != null ? dept.getName() : null;
    }

    private static Employee getCurrentEmployee() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getEmployee();
        }
        return null;
    }

    public static String getCurrentEmployeeRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        if (authorities != null && !authorities.isEmpty()) {
            // Lấy role đầu tiên (nếu có nhiều role, có thể chỉnh thành List)
            return authorities.iterator().next().getAuthority(); // ví dụ: "ADMIN" hoặc "ADMIN"
        }
        return null;
    }
}