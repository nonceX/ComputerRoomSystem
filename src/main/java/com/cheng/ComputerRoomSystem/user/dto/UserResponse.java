package com.cheng.ComputerRoomSystem.user.dto;

import com.cheng.ComputerRoomSystem.user.User;
import lombok.Getter;

@Getter
public class UserResponse {

    private final Long id;
    private final String name;
    private final String no;
    private final String dept;
    private final String role;
    private final String roleCode;
    private final String phone;
    private final String username;

    private UserResponse(User user) {
        this.id = user.getId();
        this.name = user.getRealName();
        this.no = user.getEmployeeNo();
        this.dept = user.getDepartment();
        this.roleCode = user.getRoleCode();
        this.role = toRoleName(user.getRoleCode());
        this.phone = user.getPhone();
        this.username = user.getUsername();
    }

    public static UserResponse from(User user) {
        return new UserResponse(user); // 直接调用
    }

    private static String toRoleName(String roleCode) {
        if (roleCode == null) {
            return "普通用户";
        }
        return switch (roleCode) {
            case "root"  -> "超级管理员";
            case "admin" -> "管理员";
            default      -> "普通用户";
        };
    }
}