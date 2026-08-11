package com.cheng.ComputerRoomSystem.role.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Getter
@Setter
public class PermissionUpdateRequest {
    @NotNull(message = "权限列表不能为空")
    private Set<String> permissions;
}
