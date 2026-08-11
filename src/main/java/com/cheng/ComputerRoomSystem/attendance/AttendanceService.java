package com.cheng.ComputerRoomSystem.attendance;

import com.cheng.ComputerRoomSystem.attendance.dto.AttendanceResponse;
import com.cheng.ComputerRoomSystem.attendance.dto.AttendanceStatisticsResponse;
import com.cheng.ComputerRoomSystem.common.BusinessException;
import com.cheng.ComputerRoomSystem.common.PageResult;
import com.cheng.ComputerRoomSystem.security.SecurityUtils;
import com.cheng.ComputerRoomSystem.user.User;
import com.cheng.ComputerRoomSystem.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService {

    private static final LocalTime START_TIME = LocalTime.of(9, 0);
    private static final LocalTime END_TIME = LocalTime.of(18, 0);

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    @Transactional
    public AttendanceResponse checkIn() {
        Long userId = SecurityUtils.getCurrentUserId();
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        if (attendanceRepository.findByUserIdAndAttendanceDate(userId, today).isPresent()) {
            throw new BusinessException("今天已经参会打卡，不能重复打卡");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));
        Attendance record = new Attendance();
        record.setUserId(userId);
        record.setUserName(user.getRealName());
        record.setAttendanceDate(today);
        record.setCheckInTime(now);
        record.setCheckInStatus(now.isAfter(START_TIME) ? "LATE" : "NORMAL");
        return AttendanceResponse.from(attendanceRepository.save(record));
    }

    @Transactional
    public AttendanceResponse checkOut() {
        Long userId = SecurityUtils.getCurrentUserId();
        LocalTime now = LocalTime.now();
        Attendance record = attendanceRepository
                .findByUserIdAndAttendanceDate(userId, LocalDate.now())
                .orElseThrow(() -> new BusinessException("请先完成参会打卡"));
        if (record.getCheckOutTime() != null) {
            throw new BusinessException("今天已经结束打卡，不能重复打卡");
        }

        record.setCheckOutTime(now);
        record.setCheckOutStatus(now.isBefore(END_TIME) ? "EARLY" : "NORMAL");
        return AttendanceResponse.from(attendanceRepository.save(record));
    }

    public PageResult<AttendanceResponse> myRecords(String month, int page, int size) {
        Long userId = SecurityUtils.getCurrentUserId();
        YearMonth yearMonth = parseMonth(month);
        return PageResult.of(
                attendanceRepository.findByUserIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(
                        userId,
                        yearMonth.atDay(1),
                        yearMonth.atEndOfMonth(),
                        PageRequest.of(safePage(page), safeSize(size))
                ),
                AttendanceResponse::from
        );
    }

    public AttendanceStatisticsResponse myStatistics(String month) {
        Long userId = SecurityUtils.getCurrentUserId();
        YearMonth yearMonth = parseMonth(month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();
        return new AttendanceStatisticsResponse(
                attendanceRepository.countByUserIdAndAttendanceDateBetween(userId, start, end),
                attendanceRepository.countByUserIdAndAttendanceDateBetweenAndCheckInStatus(
                        userId, start, end, "NORMAL"),
                attendanceRepository.countByUserIdAndAttendanceDateBetweenAndCheckInStatus(
                        userId, start, end, "LATE"),
                attendanceRepository.countByUserIdAndAttendanceDateBetweenAndCheckOutStatus(
                        userId, start, end, "NORMAL"),
                attendanceRepository.countByUserIdAndAttendanceDateBetweenAndCheckOutStatus(
                        userId, start, end, "EARLY"),
                attendanceRepository.countByUserIdAndAttendanceDateBetweenAndCheckOutTimeIsNull(
                        userId, start, end)
        );
    }

    public PageResult<AttendanceResponse> allRecords(String month, int page, int size) {
        YearMonth yearMonth = parseMonth(month);
        return PageResult.of(
                attendanceRepository.findByAttendanceDateBetweenOrderByAttendanceDateDesc(
                        yearMonth.atDay(1),
                        yearMonth.atEndOfMonth(),
                        PageRequest.of(safePage(page), safeSize(size))
                ),
                AttendanceResponse::from
        );
    }

    private YearMonth parseMonth(String month) {
        if (month == null || month.isBlank()) {
            return YearMonth.now();
        }
        try {
            return YearMonth.parse(month.trim());
        } catch (DateTimeParseException e) {
            throw new BusinessException("月份格式不正确，应为 yyyy-MM");
        }
    }

    private int safePage(int page) {
        return Math.max(page, 1) - 1;
    }

    private int safeSize(int size) {
        return Math.max(1, Math.min(size, 100));
    }
}
