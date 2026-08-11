package com.cheng.ComputerRoomSystem.dashboard;

import com.cheng.ComputerRoomSystem.common.Result;
import com.cheng.ComputerRoomSystem.dashboard.dto.DashboardActivityResponse;
import com.cheng.ComputerRoomSystem.dashboard.dto.DashboardSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public Result<DashboardSummaryResponse> summary() {
        return Result.success(dashboardService.summary());
    }

    @GetMapping("/activities")
    public Result<List<DashboardActivityResponse>> activities(
            @RequestParam(name = "limit", defaultValue = "10") int limit) {
        return Result.success(dashboardService.activities(limit));
    }
}
