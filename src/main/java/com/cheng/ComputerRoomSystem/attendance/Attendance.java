package com.cheng.ComputerRoomSystem.attendance;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.*;

@Getter
@Setter
@Entity
@Table(name = "attendance_record",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_attendance_user_date",
                columnNames = {"user_id", "attendance_date"}))
public class Attendance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id", nullable = false)
    private Long userId;
    @Column(name = "user_name", nullable = false, length = 50)
    private String userName;
    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;
    @Column(name = "check_in_time")
    private LocalTime checkInTime;
    @Column(name = "check_out_time")
    private LocalTime checkOutTime;
    @Column(name = "check_in_status", length = 20)
    private String checkInStatus;
    @Column(name = "check_out_status", length = 20)
    private String checkOutStatus;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate
    void onUpdate() { updatedAt = LocalDateTime.now(); }
}
