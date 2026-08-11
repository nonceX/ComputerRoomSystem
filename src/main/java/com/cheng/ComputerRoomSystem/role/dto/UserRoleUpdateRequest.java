package com.cheng.ComputerRoomSystem.role.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRoleUpdateRequest {
    @NotBlank(message = "角色编码不能为空")
    private String roleCode;
}
