package com.cheng.ComputerRoomSystem.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity //对应数据库的一张表
@Table(name = "sys_user") //明确数据库表名

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  //主键自增
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(name = "real_name", nullable = false, length = 50)
    private String realName;

    @Column(name = "employee_no", nullable = false, unique = true, length = 20)
    private String employeeNo;

    @Column(length = 50)
    private String department;

    @Column(length = 20)
    private String phone;

    @Column(name = "role_code", nullable = false, length = 20)
    private String roleCode = "user";  // 新建对象时默认是普通用户

    @Column(nullable = false)
    private Integer status = 1;  // 默认启用

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
