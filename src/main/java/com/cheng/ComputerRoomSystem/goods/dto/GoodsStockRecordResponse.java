package com.cheng.ComputerRoomSystem.goods.dto;

import com.cheng.ComputerRoomSystem.goods.GoodsStockRecord;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record GoodsStockRecordResponse(
        Long id,
        Long goodsId,
        String goodsName,
        String recordType,
        Integer quantity,
        LocalDate businessDate,
        Long operatorId,
        String operatorName,
        String remark,
        LocalDateTime createdAt
) {
    public static GoodsStockRecordResponse from(GoodsStockRecord record) {
        return new GoodsStockRecordResponse(
                record.getId(),
                record.getGoodsId(),
                record.getGoodsName(),
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
