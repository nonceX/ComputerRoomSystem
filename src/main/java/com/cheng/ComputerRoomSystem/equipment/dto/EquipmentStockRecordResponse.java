package com.cheng.ComputerRoomSystem.equipment.dto;

import com.cheng.ComputerRoomSystem.equipment.EquipmentStockRecord;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record EquipmentStockRecordResponse(
        Long id,
        Long equipmentId,
        String equipmentName,
        String recordType,
        Integer quantity,
        LocalDate businessDate,
        Long operatorId,
        String operatorName,
        String remark,
        LocalDateTime createdAt
) {
    public static EquipmentStockRecordResponse from(EquipmentStockRecord record) {
        return new EquipmentStockRecordResponse(
                record.getId(),
                record.getEquipmentId(),
                record.getEquipmentName(),
                record.getRecordType(),
                record.getQuantity(),
                record.getBusinessDate(),
                record.getOperatorId(),
                record.getOperatorName(),
                record.getRemark(),
                record.getCreatedAt()
        );
    }
}
