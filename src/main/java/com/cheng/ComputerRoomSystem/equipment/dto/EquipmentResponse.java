package com.cheng.ComputerRoomSystem.equipment.dto;

import com.cheng.ComputerRoomSystem.equipment.Equipment;

import java.time.LocalDateTime;

public record EquipmentResponse(
        Long id,
        String equipmentNo,
        String name,
        String model,
        Integer quantity,
        String status,
        String location,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static EquipmentResponse from(Equipment equipment) {
        return new EquipmentResponse(
                equipment.getId(),
                equipment.getEquipmentNo(),
                equipment.getName(),
                equipment.getModel(),
                equipment.getQuantity(),
                equipment.getStatus(),
                equipment.getLocation(),
                equipment.getCreatedAt(),
                equipment.getUpdatedAt()
        );
    }
}
