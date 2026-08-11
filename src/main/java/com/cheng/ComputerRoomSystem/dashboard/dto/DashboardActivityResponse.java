package com.cheng.ComputerRoomSystem.dashboard.dto;

import java.time.LocalDateTime;

public record DashboardActivityResponse(
        String module,
        String action,
        String description,
        LocalDateTime createdAt
) {
}
