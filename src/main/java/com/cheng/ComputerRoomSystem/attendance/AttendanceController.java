package com.cheng.ComputerRoomSystem.attendance;

import com.cheng.ComputerRoomSystem.attendance.dto.AttendanceResponse;
import com.cheng.ComputerRoomSystem.attendance.dto.AttendanceStatisticsResponse;
import com.cheng.ComputerRoomSystem.common.PageResult;
import com.cheng.ComputerRoomSystem.common.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PreAuthorize("hasAuthority('attendance:record')")
    @PostMapping("/check-in")
    public Result<AttendanceResponse> checkIn() {
        return Result.success(attendanceService.checkIn());
    }

    @PreAuthorize("hasAuthority('attendance:record')")
    @PostMapping("/check-out")
    public Result<AttendanceResponse> checkOut() {
        return Result.success(attendanceService.checkOut());
    }

    @PreAuthorize("hasAuthority('attendance:view')")
    @GetMapping("/my")
    public Result<PageResult<AttendanceResponse>> myRecords(
            @RequestParam(name = "month", required = false) String month,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return Result.success(attendanceService.myRecords(month, page, size));
    }

    @PreAuthorize("hasAuthority('attendance:view')")
    @GetMapping("/my/statistics")
    public Result<AttendanceStatisticsResponse> myStatistics(
            @RequestParam(name = "month", required = false) String month) {
        return Result.success(attendanceService.myStatistics(month));
    }

    @PreAuthorize("hasRole('admin') or hasRole('root')")
    @GetMapping("/all")
    public Result<PageResult<AttendanceResponse>> allRecords(
            @RequestParam(name = "month", required = false) String month,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return Result.success(attendanceService.allRecords(month, page, size));
    }
}
