package com.cheng.ComputerRoomSystem.attendance.dto;

public record AttendanceStatisticsResponse(
        long attendanceDays,
        long normalCheckInCount,
        long lateCount,
        long normalCheckOutCount,
        long earlyCount,
        long missingCheckOutCount
) {
}
