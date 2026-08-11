package com.cheng.ComputerRoomSystem.security;

import com.cheng.ComputerRoomSystem.user.User;
import com.cheng.ComputerRoomSystem.user.UserRepository;
import com.cheng.ComputerRoomSystem.role.RoleRepository;
import java.util.ArrayList;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;


    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = extractToken(request);

        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Long userId = jwtService.parseUserId(token);
            if (userId != null) {
                userRepository.findById(userId)
                        .filter(u -> u.getStatus() != null && u.getStatus() == 1)
                        .ifPresent(this::authenticate);
            }
        }

        filterChain.doFilter(request, response);
    }

    private void authenticate(User user) {
        AuthUser authUser = new AuthUser(user.getId(), user.getUsername(), user.getRoleCode());
        var authorities = new ArrayList<SimpleGrantedAuthority>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRoleCode()));

        roleRepository.findByCode(user.getRoleCode())
                .ifPresent(role -> role.getPermissions().forEach(permission ->
                        authorities.add(new SimpleGrantedAuthority(permission.getCode()))));

        var authentication = new UsernamePasswordAuthenticationToken(authUser, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}