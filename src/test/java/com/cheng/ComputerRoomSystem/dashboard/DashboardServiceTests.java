package com.cheng.ComputerRoomSystem.dashboard;

import com.cheng.ComputerRoomSystem.attendance.Attendance;
import com.cheng.ComputerRoomSystem.attendance.AttendanceRepository;
import com.cheng.ComputerRoomSystem.equipment.EquipmentRepository;
import com.cheng.ComputerRoomSystem.equipment.EquipmentStockRecord;
import com.cheng.ComputerRoomSystem.equipment.EquipmentStockRecordRepository;
import com.cheng.ComputerRoomSystem.goods.GoodsRepository;
import com.cheng.ComputerRoomSystem.goods.GoodsStockRecord;
import com.cheng.ComputerRoomSystem.goods.GoodsStockRecordRepository;
import com.cheng.ComputerRoomSystem.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTests {

    @Mock
    private UserRepository userRepository;
    @Mock
    private EquipmentRepository equipmentRepository;
    @Mock
    private GoodsRepository goodsRepository;
    @Mock
    private AttendanceRepository attendanceRepository;
    @Mock
    private EquipmentStockRecordRepository equipmentRecordRepository;
    @Mock
    private GoodsStockRecordRepository goodsRecordRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void summaryUsesDatabaseAggregates() {
        when(userRepository.count()).thenReturn(13L);
        when(equipmentRepository.sumAvailableQuantity()).thenReturn(48L);
        when(attendanceRepository.countByAttendanceDate(LocalDate.now())).thenReturn(9L);
        when(goodsRepository.countWarnings()).thenReturn(3L);

        var summary = dashboardService.summary();

        assertEquals(13L, summary.userCount());
        assertEquals(48L, summary.equipmentQuantity());
        assertEquals(9L, summary.todayAttendanceCount());
        assertEquals(3L, summary.lowStockCount());
        verify(userRepository).count();
        verify(equipmentRepository).sumAvailableQuantity();
        verify(goodsRepository).countWarnings();
    }

    @Test
    void activitiesMergeSortAndApplyLimit() {
        EquipmentStockRecord equipment = equipmentRecord(LocalDateTime.of(2026, 8, 11, 9, 0));
        GoodsStockRecord goods = goodsRecord(LocalDateTime.of(2026, 8, 11, 11, 0));
        Attendance attendance = attendance(LocalDateTime.of(2026, 8, 11, 10, 0));
        when(equipmentRecordRepository.findAllByOrderByCreatedAtDesc(any()))
                .thenReturn(new PageImpl<>(List.of(equipment)));
        when(goodsRecordRepository.findAllByOrderByCreatedAtDesc(any()))
                .thenReturn(new PageImpl<>(List.of(goods)));
        when(attendanceRepository.findAllByOrderByUpdatedAtDesc(any()))
                .thenReturn(new PageImpl<>(List.of(attendance)));

        var activities = dashboardService.activities(2);

        assertEquals(2, activities.size());
        assertEquals("goods", activities.get(0).module());
        assertEquals("attendance", activities.get(1).module());
    }

    @Test
    void activityLimitIsCappedAtFifty() {
        when(equipmentRecordRepository.findAllByOrderByCreatedAtDesc(any()))
                .thenReturn(new PageImpl<>(List.of()));
        when(goodsRecordRepository.findAllByOrderByCreatedAtDesc(any()))
                .thenReturn(new PageImpl<>(List.of()));
        when(attendanceRepository.findAllByOrderByUpdatedAtDesc(any()))
                .thenReturn(new PageImpl<>(List.of()));

        dashboardService.activities(500);

        ArgumentCaptor<Pageable> captor = ArgumentCaptor.forClass(Pageable.class);
        verify(equipmentRecordRepository).findAllByOrderByCreatedAtDesc(captor.capture());
        assertEquals(50, captor.getValue().getPageSize());
    }

    private EquipmentStockRecord equipmentRecord(LocalDateTime createdAt) {
        EquipmentStockRecord record = new EquipmentStockRecord();
        record.setRecordType("IN");
        record.setOperatorName("admin");
        record.setEquipmentName("交换机");
        record.setQuantity(2);
        record.setCreatedAt(createdAt);
        return record;
    }

    private GoodsStockRecord goodsRecord(LocalDateTime createdAt) {
        GoodsStockRecord record = new GoodsStockRecord();
        record.setRecordType("OUT");
        record.setOperatorName("admin");
        record.setGoodsName("网线");
        record.setQuantity(3);
        record.setCreatedAt(createdAt);
        return record;
    }

    private Attendance attendance(LocalDateTime updatedAt) {
        Attendance attendance = new Attendance();
        attendance.setUserName("张三");
        attendance.setCheckOutTime(LocalTime.of(18, 5));
        attendance.setUpdatedAt(updatedAt);
        attendance.setCreatedAt(updatedAt.minusHours(8));
        return attendance;
    }
}
