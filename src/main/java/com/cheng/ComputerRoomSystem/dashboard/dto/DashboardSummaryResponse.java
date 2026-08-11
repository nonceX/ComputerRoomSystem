package com.cheng.ComputerRoomSystem.dashboard.dto;

public record DashboardSummaryResponse(
        long userCount,
        long equipmentQuantity,
        long todayAttendanceCount,
        long lowStockCount
) {
}
