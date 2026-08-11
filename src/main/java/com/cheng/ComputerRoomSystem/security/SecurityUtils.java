package com.cheng.ComputerRoomSystem.security;

import com.cheng.ComputerRoomSystem.common.BusinessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AuthUser user)) {
            throw new BusinessException("未登录");
        }
        return user.id();
    }

    public static AuthUser getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AuthUser user)) {
            throw new BusinessException("未登录");
        }
        return user;
    }

    public static boolean isRoot() {
        return "root".equals(getCurrentUser().roleCode());
    }
}
