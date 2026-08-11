package com.cheng.ComputerRoomSystem.attendance;

import com.cheng.ComputerRoomSystem.common.BusinessException;
import com.cheng.ComputerRoomSystem.security.AuthUser;
import com.cheng.ComputerRoomSystem.user.User;
import com.cheng.ComputerRoomSystem.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTests {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AttendanceService attendanceService;

    @BeforeEach
    void authenticateUser() {
        AuthUser user = new AuthUser(7L, "zhangsan", "user");
        var authentication = new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void clearAuthentication() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void checkInUsesCurrentJwtUserAndServerTime() {
        User user = new User();
        user.setId(7L);
        user.setRealName("张三");
        when(attendanceRepository.findByUserIdAndAttendanceDate(7L, LocalDate.now()))
                .thenReturn(Optional.empty());
        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(attendanceRepository.save(any(Attendance.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = attendanceService.checkIn();

        ArgumentCaptor<Attendance> captor = ArgumentCaptor.forClass(Attendance.class);
        verify(attendanceRepository).save(captor.capture());
        Attendance saved = captor.getValue();
        assertEquals(7L, saved.getUserId());
        assertEquals("张三", saved.getUserName());
        assertEquals(LocalDate.now(), saved.getAttendanceDate());
        assertNotNull(saved.getCheckInTime());
        assertEquals(7L, response.userId());
    }

    @Test
    void duplicateCheckInIsRejectedBeforeInsert() {
        when(attendanceRepository.findByUserIdAndAttendanceDate(7L, LocalDate.now()))
                .thenReturn(Optional.of(new Attendance()));

        BusinessException error = assertThrows(BusinessException.class, attendanceService::checkIn);

        assertEquals("今天已经参会打卡，不能重复打卡", error.getMessage());
        verify(userRepository, never()).findById(any());
        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void checkOutWithoutCheckInIsRejected() {
        when(attendanceRepository.findByUserIdAndAttendanceDate(7L, LocalDate.now()))
                .thenReturn(Optional.empty());

        BusinessException error = assertThrows(BusinessException.class, attendanceService::checkOut);

        assertEquals("请先完成参会打卡", error.getMessage());
        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void duplicateCheckOutIsRejected() {
        Attendance attendance = new Attendance();
        attendance.setCheckOutTime(LocalTime.NOON);
        when(attendanceRepository.findByUserIdAndAttendanceDate(7L, LocalDate.now()))
                .thenReturn(Optional.of(attendance));

        BusinessException error = assertThrows(BusinessException.class, attendanceService::checkOut);

        assertEquals("今天已经结束打卡，不能重复打卡", error.getMessage());
        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void monthQueryIncludesFirstAndLastDay() {
        when(attendanceRepository.findByUserIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(
                any(), any(), any(), any()))
                .thenReturn(new PageImpl<>(List.of()));

        attendanceService.myRecords("2026-02", 1, 10);

        ArgumentCaptor<LocalDate> start = ArgumentCaptor.forClass(LocalDate.class);
        ArgumentCaptor<LocalDate> end = ArgumentCaptor.forClass(LocalDate.class);
        ArgumentCaptor<Pageable> pageable = ArgumentCaptor.forClass(Pageable.class);
        verify(attendanceRepository).findByUserIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(
                org.mockito.ArgumentMatchers.eq(7L), start.capture(), end.capture(), pageable.capture());
        assertEquals(LocalDate.of(2026, 2, 1), start.getValue());
        assertEquals(LocalDate.of(2026, 2, 28), end.getValue());
        assertEquals(0, pageable.getValue().getPageNumber());
        assertEquals(10, pageable.getValue().getPageSize());
    }
}
