package com.cheng.ComputerRoomSystem.dashboard;

import com.cheng.ComputerRoomSystem.attendance.Attendance;
import com.cheng.ComputerRoomSystem.attendance.AttendanceRepository;
import com.cheng.ComputerRoomSystem.dashboard.dto.DashboardActivityResponse;
import com.cheng.ComputerRoomSystem.dashboard.dto.DashboardSummaryResponse;
import com.cheng.ComputerRoomSystem.equipment.EquipmentRepository;
import com.cheng.ComputerRoomSystem.equipment.EquipmentStockRecord;
import com.cheng.ComputerRoomSystem.equipment.EquipmentStockRecordRepository;
import com.cheng.ComputerRoomSystem.goods.GoodsRepository;
import com.cheng.ComputerRoomSystem.goods.GoodsStockRecord;
import com.cheng.ComputerRoomSystem.goods.GoodsStockRecordRepository;
import com.cheng.ComputerRoomSystem.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;
    private final GoodsRepository goodsRepository;
    private final AttendanceRepository attendanceRepository;
    private final EquipmentStockRecordRepository equipmentRecordRepository;
    private final GoodsStockRecordRepository goodsRecordRepository;

    public DashboardSummaryResponse summary() {
        return new DashboardSummaryResponse(
                userRepository.count(),
                equipmentRepository.sumAvailableQuantity(),
                attendanceRepository.countByAttendanceDate(LocalDate.now()),
                goodsRepository.countWarnings()
        );
    }

    public List<DashboardActivityResponse> activities(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 50));
        PageRequest request = PageRequest.of(0, safeLimit);
        List<DashboardActivityResponse> activities = new ArrayList<>();

        equipmentRecordRepository.findAllByOrderByCreatedAtDesc(request).getContent().stream()
                .map(this::fromEquipmentRecord)
                .forEach(activities::add);
        goodsRecordRepository.findAllByOrderByCreatedAtDesc(request).getContent().stream()
                .map(this::fromGoodsRecord)
                .forEach(activities::add);
        attendanceRepository.findAllByOrderByUpdatedAtDesc(request).getContent().stream()
                .map(this::fromAttendance)
                .forEach(activities::add);

        return activities.stream()
                .sorted(Comparator.comparing(
                        DashboardActivityResponse::createdAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .limit(safeLimit)
                .toList();
    }

    private DashboardActivityResponse fromEquipmentRecord(EquipmentStockRecord record) {
        String action = "IN".equals(record.getRecordType()) ? "入库" : "出库";
        return new DashboardActivityResponse(
                "equipment",
                record.getRecordType(),
                record.getOperatorName() + " " + action + "设备 "
                        + record.getEquipmentName() + " x " + record.getQuantity(),
                record.getCreatedAt()
        );
    }

    private DashboardActivityResponse fromGoodsRecord(GoodsStockRecord record) {
        String action = "IN".equals(record.getRecordType()) ? "入库" : "出库";
        return new DashboardActivityResponse(
                "goods",
                record.getRecordType(),
                record.getOperatorName() + " " + action + "耗材 "
                        + record.getGoodsName() + " x " + record.getQuantity(),
                record.getCreatedAt()
        );
    }

    private DashboardActivityResponse fromAttendance(Attendance attendance) {
        boolean checkedOut = attendance.getCheckOutTime() != null;
        return new DashboardActivityResponse(
                "attendance",
                checkedOut ? "CHECK_OUT" : "CHECK_IN",
                attendance.getUserName() + (checkedOut ? " 完成结束打卡" : " 完成参会打卡"),
                checkedOut ? attendance.getUpdatedAt() : attendance.getCreatedAt()
        );
    }
}
