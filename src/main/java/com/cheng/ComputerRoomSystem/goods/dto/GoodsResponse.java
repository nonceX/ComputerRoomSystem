package com.cheng.ComputerRoomSystem.goods.dto;

import com.cheng.ComputerRoomSystem.goods.Goods;

import java.time.LocalDateTime;

public record GoodsResponse(
        Long id,
        String goodsNo,
        String name,
        String category,
        String unit,
        Integer stock,
        Integer safeStock,
        boolean lowStock,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static GoodsResponse from(Goods goods) {
        return new GoodsResponse(
                goods.getId(),
                goods.getGoodsNo(),
                goods.getName(),
                goods.getCategory(),
                goods.getUnit(),
                goods.getStock(),
                goods.getSafeStock(),
                goods.getStock() < goods.getSafeStock(),
                goods.getCreatedAt(),
                goods.getUpdatedAt()
        );
    }
}
