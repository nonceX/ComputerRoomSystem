package com.cheng.ComputerRoomSystem.attendance.dto;

import com.cheng.ComputerRoomSystem.attendance.Attendance;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record AttendanceResponse(
        Long id,
        Long userId,
        String userName,
        LocalDate attendanceDate,
        LocalTime checkInTime,
        LocalTime checkOutTime,
        String checkInStatus,
        String checkOutStatus,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static AttendanceResponse from(Attendance attendance) {
        return new AttendanceResponse(
                attendance.getId(),
                attendance.getUserId(),
                attendance.getUserName(),
                attendance.getAttendanceDate(),
                attendance.getCheckInTime(),
                attendance.getCheckOutTime(),
                translateStatus(attendance.getCheckInStatus()),
                translateStatus(attendance.getCheckOutStatus()),
                attendance.getCreatedAt(),
                attendance.getUpdatedAt()
        );
    }

    private static String translateStatus(String status) {
        if (status == null) {
            return "未打卡";
        }
        return switch (status) {
            case "LATE" -> "迟到";
            case "EARLY" -> "早退";
            case "NORMAL" -> "正常";
            default -> status;
        };
    }
}
