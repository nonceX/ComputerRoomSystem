package com.cheng.ComputerRoomSystem.user;
//负责把 HTTP 请求翻译成 Java 方法调用

import com.cheng.ComputerRoomSystem.common.PageResult;
import com.cheng.ComputerRoomSystem.common.Result;
import com.cheng.ComputerRoomSystem.user.dto.UserCreateRequest;
import com.cheng.ComputerRoomSystem.user.dto.UserResponse;
import com.cheng.ComputerRoomSystem.user.dto.UserUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.cheng.ComputerRoomSystem.role.RoleService;
import com.cheng.ComputerRoomSystem.role.dto.UserRoleUpdateRequest;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final RoleService roleService;

    @PreAuthorize("hasRole('root')")
    @PutMapping("/{id}/role")
    public Result<Void> changeRole(
            @PathVariable("id") Long id,
            @Valid @RequestBody UserRoleUpdateRequest request) {
        roleService.changeUserRole(id, request.getRoleCode());
        return Result.success();
    }

    @PreAuthorize("hasAuthority('person:view')")
    @GetMapping
    public Result<PageResult<UserResponse>> list(
            @RequestParam(name = "realName", required = false) String realName,
            @RequestParam(name = "dept", required = false) String dept,
            @RequestParam(name = "roleCode", required = false) String roleCode,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return Result.success(userService.search(realName, dept, roleCode, page, size));
    }

    @PreAuthorize("hasAuthority('person:view')")
    @GetMapping("/{id}")
    public Result<UserResponse> getById(@PathVariable("id") Long id) {
        return Result.success(userService.getById(id));
    }

    @PreAuthorize("hasAuthority('person:add')")
    @PostMapping
    public Result<UserResponse> create(@Valid @RequestBody UserCreateRequest request) {
        return Result.success(userService.create(request));
    }

    @PreAuthorize("hasAuthority('person:edit')")
    @PutMapping("/{id}")
    public Result<UserResponse> update(@PathVariable("id") Long id,
                                       @Valid @RequestBody UserUpdateRequest request) {
        return Result.success(userService.update(id, request));
    }

    @PreAuthorize("hasAuthority('person:delete')")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        userService.delete(id);
        return Result.success();
    }

    @PreAuthorize("hasAuthority('person:delete')")
    @DeleteMapping
    public Result<Void> deleteBatch(@RequestBody List<Long> ids) {
        userService.deleteBatch(ids);
        return Result.success();
    }
}
