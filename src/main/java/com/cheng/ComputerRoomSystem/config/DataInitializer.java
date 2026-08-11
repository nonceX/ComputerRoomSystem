package com.cheng.ComputerRoomSystem.config;

import com.cheng.ComputerRoomSystem.user.User;
import com.cheng.ComputerRoomSystem.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final String INITIAL_ROOT_USERNAME = "root";
    private static final String INITIAL_ROOT_PASSWORD = "123456";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        ensureRootUser();

        List<User> plainUsers = userRepository.findAll().stream()
                .filter(u -> "temp".equals(u.getPassword()))
                .toList();

        if (plainUsers.isEmpty()) {
            return;
        }

        plainUsers.forEach(u -> u.setPassword(passwordEncoder.encode(INITIAL_ROOT_PASSWORD)));
        userRepository.saveAll(plainUsers);

        log.warn("已将 {} 个明文密码账号的密码重置为 123456", plainUsers.size());
    }

    private void ensureRootUser() {
        User root = userRepository.findByUsername(INITIAL_ROOT_USERNAME).orElse(null);
        if (root != null) {
            if (!"root".equals(root.getRoleCode())) {
                root.setRoleCode("root");
                root.setStatus(1);
                userRepository.save(root);
                log.warn("已将账号 root 恢复为超级管理员角色");
            }
            return;
        }

        User initialRoot = new User();
        initialRoot.setUsername(INITIAL_ROOT_USERNAME);
        initialRoot.setPassword(passwordEncoder.encode(INITIAL_ROOT_PASSWORD));
        initialRoot.setRealName("超级管理员");
        initialRoot.setEmployeeNo("ROOT");
        initialRoot.setDepartment("技术部");
        initialRoot.setRoleCode("root");
        initialRoot.setStatus(1);
        userRepository.save(initialRoot);
        log.warn("已创建初始超级管理员 root，初始密码为 123456，请登录后立即修改");
    }
}
