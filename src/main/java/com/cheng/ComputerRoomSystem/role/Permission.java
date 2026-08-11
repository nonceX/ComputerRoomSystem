package com.cheng.ComputerRoomSystem.role;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sys_permission")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "perm_code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "perm_name", nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 30)
    private String module;
}