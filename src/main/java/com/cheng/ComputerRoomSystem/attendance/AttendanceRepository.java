package com.cheng.ComputerRoomSystem.attendance;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByUserIdAndAttendanceDate(Long userId, LocalDate date);

    Page<Attendance> findByUserIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(
            Long userId, LocalDate start, LocalDate end, Pageable pageable);

    Page<Attendance> findByAttendanceDateBetweenOrderByAttendanceDateDesc(
            LocalDate start, LocalDate end, Pageable pageable);

    Page<Attendance> findAllByOrderByUpdatedAtDesc(Pageable pageable);

    long countByAttendanceDate(LocalDate date);

    long countByUserIdAndAttendanceDateBetween(Long userId, LocalDate start, LocalDate end);

    long countByUserIdAndAttendanceDateBetweenAndCheckInStatus(
            Long userId, LocalDate start, LocalDate end, String status);

    long countByUserIdAndAttendanceDateBetweenAndCheckOutStatus(
            Long userId, LocalDate start, LocalDate end, String status);

    long countByUserIdAndAttendanceDateBetweenAndCheckOutTimeIsNull(
            Long userId, LocalDate start, LocalDate end);
}
