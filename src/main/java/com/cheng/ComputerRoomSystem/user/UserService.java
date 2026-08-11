package com.cheng.ComputerRoomSystem.user;

import com.cheng.ComputerRoomSystem.common.BusinessException;
import com.cheng.ComputerRoomSystem.common.PageResult;
import com.cheng.ComputerRoomSystem.user.dto.UserCreateRequest;
import com.cheng.ComputerRoomSystem.user.dto.UserResponse;
import com.cheng.ComputerRoomSystem.user.dto.UserUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PageResult<UserResponse> search(String realName, String dept, String roleCode,
                                           int page, int size) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.max(1, Math.min(size, 100));
        Pageable pageable = PageRequest.of(safePage - 1, safeSize);
        return PageResult.of(
                userRepository.search(blankToNull(realName), blankToNull(dept),
                        blankToNull(roleCode), pageable),
                UserResponse::from
        );
    }

    public UserResponse getById(Long id) {
        return UserResponse.from(findEntity(id));
    }

    @Transactional
    public UserResponse create(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("登录账号已存在：" + request.getUsername());
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

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(Long id, UserUpdateRequest request) {
        User user = findEntity(id);

        if (!user.getEmployeeNo().equals(request.getNo())
                && userRepository.existsByEmployeeNo(request.getNo())) {
            throw new BusinessException("工号已被其他人使用：" + request.getNo());
        }

        user.setRealName(request.getName());
        user.setEmployeeNo(request.getNo());
        user.setDepartment(request.getDept());
        user.setPhone(request.getPhone());

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        User user = findEntity(id);
        if ("root".equals(user.getRoleCode())) {
            throw new BusinessException("超级管理员不能被删除");
        }
        userRepository.delete(user);
    }

    @Transactional
    public void deleteBatch(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new BusinessException("请至少选择一条记录");
        }
        ids.forEach(this::delete);
    }

    private User findEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("用户不存在，id=" + id));
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
