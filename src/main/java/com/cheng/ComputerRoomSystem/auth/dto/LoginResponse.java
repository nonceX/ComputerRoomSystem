package com.cheng.ComputerRoomSystem.auth.dto;

import com.cheng.ComputerRoomSystem.user.User;
import lombok.Getter;

@Getter
public class LoginResponse {

    private final String token;
    private final UserInfo user;

    public LoginResponse(String token, User user) {
        this.token = token;
        this.user = new UserInfo(user);
    }

    @Getter
    public static class UserInfo {
        private final Long id;
        private final String username;
        private final String name;
        private final String no;
        private final String dept;
        private final String roleCode;
        private final String role;

        UserInfo(User user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.name = user.getRealName();
            this.no = user.getEmployeeNo();
            this.dept = user.getDepartment();
            this.roleCode = user.getRoleCode();
            this.role = switch (user.getRoleCode() == null ? "user" : user.getRoleCode()) {
                case "root" -> "超级管理员";
                case "admin" -> "管理员";
                default -> "普通用户";
            };
        }
    }
}
