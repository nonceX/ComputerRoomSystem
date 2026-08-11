package com.cheng.ComputerRoomSystem.goods;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "goods_stock_record")
public class GoodsStockRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "goods_id", nullable = false)
    private Long goodsId;

    @Column(name = "goods_name", nullable = false, length = 100)
    private String goodsName;

    @Column(name = "record_type", nullable = false, length = 10)
    private String recordType;       // IN / OUT

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "business_date", nullable = false)
    private LocalDate businessDate;

    @Column(name = "operator_id", nullable = false)
    private Long operatorId;

    @Column(name = "operator_name", nullable = false, length = 50)
    private String operatorName;

    @Column(length = 500)
    private String remark;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

