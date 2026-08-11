package com.cheng.ComputerRoomSystem.auth;

import com.cheng.ComputerRoomSystem.auth.dto.ChangePasswordRequest;
import com.cheng.ComputerRoomSystem.auth.dto.LoginRequest;
import com.cheng.ComputerRoomSystem.auth.dto.LoginResponse;
import com.cheng.ComputerRoomSystem.auth.dto.RegisterRequest;
import com.cheng.ComputerRoomSystem.common.Result;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return Result.success(authService.login(request));
    }

    @PostMapping("/register")
    public Result<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        return Result.success(authService.register(request));
    }

    @GetMapping("/me")
    public Result<LoginResponse.UserInfo> me() {
        return Result.success(authService.currentUser());
    }

    @PutMapping("/password")
    public Result<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return Result.success();
    }

    @PostMapping("/logout")
    public Result<Void> logout() {
        return Result.success();
    }
}