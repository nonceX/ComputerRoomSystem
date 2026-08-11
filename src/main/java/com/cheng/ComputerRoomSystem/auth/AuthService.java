package com.cheng.ComputerRoomSystem.auth;

import com.cheng.ComputerRoomSystem.auth.dto.ChangePasswordRequest;
import com.cheng.ComputerRoomSystem.auth.dto.LoginRequest;
import com.cheng.ComputerRoomSystem.auth.dto.LoginResponse;
import com.cheng.ComputerRoomSystem.auth.dto.RegisterRequest;
import com.cheng.ComputerRoomSystem.common.BusinessException;
import com.cheng.ComputerRoomSystem.security.AuthUser;
import com.cheng.ComputerRoomSystem.security.JwtService;
import com.cheng.ComputerRoomSystem.security.SecurityUtils;
import com.cheng.ComputerRoomSystem.user.User;
import com.cheng.ComputerRoomSystem.user.UserRepository;
import com.cheng.ComputerRoomSystem.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException("账号或密码错误"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("账号或密码错误");
        }

        if (user.getStatus() == null || user.getStatus() != 1) {
            throw new BusinessException("账号已被禁用，请联系管理员");
        }

        String token = jwtService.generateToken(user.getId(), user.getUsername(), user.getRoleCode());
        return new LoginResponse(token, user);
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("登录账号已被占用：" + request.getUsername());
        }
        if (userRepository.existsByEmployeeNo(request.getNo())) {
            throw new BusinessException("工号已存在：" + request.getNo());
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRealName(request.getName());
        user.setEmployeeNo(request.getNo());
        user.setDepartment(request.getDept());
        user.setPhone(request.getPhone());
        user.setRoleCode("user");
        user.setStatus(1);

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getId(), saved.getUsername(), saved.getRoleCode());
        return new LoginResponse(token, saved);
    }

    public LoginResponse.UserInfo currentUser() {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));
        return new LoginResponse(null, user).getUser();
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BusinessException("原密码不正确");
        }
        if (request.getOldPassword().equals(request.getNewPassword())) {
            throw new BusinessException("新密码不能与原密码相同");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
