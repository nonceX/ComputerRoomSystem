package com.cheng.ComputerRoomSystem.equipment.dto;

public record EquipmentStatisticsResponse(
        long normal,
        long repair,
        long scrapped,
        long total
) {
}
