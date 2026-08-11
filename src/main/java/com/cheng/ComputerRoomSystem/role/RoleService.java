package com.cheng.ComputerRoomSystem.role;
import com.cheng.ComputerRoomSystem.common.BusinessException;
import com.cheng.ComputerRoomSystem.role.dto.PermissionUpdateRequest;
import com.cheng.ComputerRoomSystem.role.dto.RoleSummary;
import com.cheng.ComputerRoomSystem.security.SecurityUtils;
import com.cheng.ComputerRoomSystem.user.User;
import com.cheng.ComputerRoomSystem.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoleService {

    private static final Set<String> ROLES = Set.of("root", "admin", "user");
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;

    public List<RoleSummary> listRoles() {
        return roleRepository.findAll().stream()
                .map(role -> new RoleSummary(role.getCode(), role.getName()))
                .toList();
    }

    public Set<String> permissions(String roleCode) {
        return roleRepository.findByCode(roleCode)
                .orElseThrow(() -> new BusinessException("角色不存在"))
                .getPermissions().stream().map(Permission::getCode).collect(java.util.stream.Collectors.toSet());
    }

    @Transactional
    public void updatePermissions(String roleCode, PermissionUpdateRequest request) {
        if ("root".equals(roleCode)) {
            throw new BusinessException("超级管理员权限不能修改");
        }
        Role role = roleRepository.findByCode(roleCode)
                .orElseThrow(() -> new BusinessException("角色不存在"));
        List<Permission> found = permissionRepository.findByCodeIn(request.getPermissions());
        if (found.size() != request.getPermissions().size()) {
            throw new BusinessException("包含不存在的权限编码");
        }
        role.setPermissions(Set.copyOf(found));
        roleRepository.save(role);
    }

    @Transactional
    public void changeUserRole(Long userId, String roleCode) {
        if (!SecurityUtils.isRoot()) {
            throw new BusinessException("只有超级管理员可以调整角色");
        }
        if (!ROLES.contains(roleCode)) {
            throw new BusinessException("非法角色编码");
        }
        if (SecurityUtils.getCurrentUserId().equals(userId)) {
            throw new BusinessException("不能修改自己的角色");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));
        if ("root".equals(user.getRoleCode())) {
            throw new BusinessException("超级管理员不能被降权");
        }
        user.setRoleCode(roleCode);
        userRepository.save(user);
    }
}
