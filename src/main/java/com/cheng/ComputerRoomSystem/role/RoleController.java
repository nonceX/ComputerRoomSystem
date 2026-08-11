package com.cheng.ComputerRoomSystem.role;

import com.cheng.ComputerRoomSystem.common.Result;
import com.cheng.ComputerRoomSystem.role.dto.PermissionUpdateRequest;
import com.cheng.ComputerRoomSystem.role.dto.RoleSummary;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @PreAuthorize("hasAuthority('permission:view')")
    @GetMapping
    public Result<List<RoleSummary>> list() {
        return Result.success(roleService.listRoles());
    }

    @PreAuthorize("hasAuthority('permission:view')")
    @GetMapping("/{roleCode}/permissions")
    public Result<Set<String>> permissions(@PathVariable("roleCode") String roleCode) {
        return Result.success(roleService.permissions(roleCode));
    }

    @PreAuthorize("hasAuthority('permission:edit')")
    @PutMapping("/{roleCode}/permissions")
    public Result<Void> updatePermissions(
            @PathVariable("roleCode") String roleCode,
            @Valid @RequestBody PermissionUpdateRequest request) {
        roleService.updatePermissions(roleCode, request);
        return Result.success();
    }
}
