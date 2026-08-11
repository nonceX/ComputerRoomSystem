package com.cheng.ComputerRoomSystem.equipment;

import com.cheng.ComputerRoomSystem.common.BusinessException;
import com.cheng.ComputerRoomSystem.equipment.dto.EquipmentStockRequest;
import com.cheng.ComputerRoomSystem.security.AuthUser;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EquipmentServiceTests {

    @Mock
    private EquipmentRepository equipmentRepository;

    @Mock
    private EquipmentStockRecordRepository recordRepository;

    @InjectMocks
    private EquipmentService equipmentService;

    @BeforeEach
    void authenticateOperator() {
        AuthUser operator = new AuthUser(7L, "admin", "admin");
        var authentication = new UsernamePasswordAuthenticationToken(operator, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void clearAuthentication() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void stockInUpdatesQuantityAndCreatesRecordFromJwt() {
        Equipment equipment = equipment(1L, 2, "NORMAL");
        EquipmentStockRequest request = stockRequest(3);
        when(equipmentRepository.findById(1L)).thenReturn(Optional.of(equipment));

        equipmentService.changeStock(1L, request, true);

        assertEquals(5, equipment.getQuantity());
        ArgumentCaptor<EquipmentStockRecord> captor = ArgumentCaptor.forClass(EquipmentStockRecord.class);
        verify(recordRepository).save(captor.capture());
        EquipmentStockRecord record = captor.getValue();
        assertEquals("IN", record.getRecordType());
        assertEquals(3, record.getQuantity());
        assertEquals(7L, record.getOperatorId());
        assertEquals("admin", record.getOperatorName());
        assertEquals(LocalDate.now(), record.getBusinessDate());
    }

    @Test
    void stockOutOverCurrentQuantityChangesNothing() {
        Equipment equipment = equipment(1L, 2, "NORMAL");
        when(equipmentRepository.findById(1L)).thenReturn(Optional.of(equipment));

        BusinessException error = assertThrows(
                BusinessException.class,
                () -> equipmentService.changeStock(1L, stockRequest(3), false)
        );

        assertEquals("库存不足，当前库存 2", error.getMessage());
        assertEquals(2, equipment.getQuantity());
        verify(equipmentRepository, never()).save(any());
        verify(recordRepository, never()).save(any());
    }

    @Test
    void scrappedEquipmentCannotChangeStock() {
        Equipment equipment = equipment(1L, 0, "SCRAPPED");
        when(equipmentRepository.findById(1L)).thenReturn(Optional.of(equipment));

        BusinessException error = assertThrows(
                BusinessException.class,
                () -> equipmentService.changeStock(1L, stockRequest(1), true)
        );

        assertEquals("已报废设备不能出入库", error.getMessage());
        verify(equipmentRepository, never()).save(any());
        verify(recordRepository, never()).save(any());
    }

    @Test
    void equipmentWithStockCannotBeScrapped() {
        Equipment equipment = equipment(1L, 1, "NORMAL");
        when(equipmentRepository.findById(1L)).thenReturn(Optional.of(equipment));

        BusinessException error = assertThrows(BusinessException.class, () -> equipmentService.scrap(1L));

        assertEquals("库存不为 0 的设备不能报废，请先完成出库处理", error.getMessage());
        assertEquals("NORMAL", equipment.getStatus());
        verify(equipmentRepository, never()).save(any());
    }

    @Test
    void zeroStockEquipmentCanBeScrapped() {
        Equipment equipment = equipment(1L, 0, "NORMAL");
        when(equipmentRepository.findById(1L)).thenReturn(Optional.of(equipment));

        equipmentService.scrap(1L);

        assertEquals("SCRAPPED", equipment.getStatus());
        verify(equipmentRepository).save(equipment);
    }

    private Equipment equipment(Long id, int quantity, String status) {
        Equipment equipment = new Equipment();
        equipment.setId(id);
        equipment.setEquipmentNo("SB-001");
        equipment.setName("服务器");
        equipment.setQuantity(quantity);
        equipment.setStatus(status);
        equipment.setLocation("A01");
        return equipment;
    }

    private EquipmentStockRequest stockRequest(int quantity) {
        EquipmentStockRequest request = new EquipmentStockRequest();
        request.setQuantity(quantity);
        return request;
    }
}
