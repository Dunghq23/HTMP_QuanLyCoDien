package htmp.codien.quanlycodien.controller;

import org.springframework.web.bind.annotation.*;

import htmp.codien.quanlycodien.dto.role.RoleResponse;
import htmp.codien.quanlycodien.model.enums.Role;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @GetMapping
    public List<RoleResponse> getAllRoles() {
        return Arrays.stream(Role.values())
                .map(role -> new RoleResponse(role.name(), role.getDescription()))
                .collect(Collectors.toList());
    }
}
