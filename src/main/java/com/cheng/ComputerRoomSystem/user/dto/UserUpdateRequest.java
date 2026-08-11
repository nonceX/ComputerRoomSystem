package com.cheng.ComputerRoomSystem.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {

    @NotBlank(message = "姓名不能为空")
    @Size(max = 50, message = "姓名不能超过 50 个字")
    private String name;

    @NotBlank(message = "工号不能为空")
    @Size(max = 20, message = "工号不能超过 20 位")
    private String no;

    @Size(max = 50, message = "部门名称不能超过 50 个字")
    private String dept;

    @Pattern(regexp = "^$|^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

}