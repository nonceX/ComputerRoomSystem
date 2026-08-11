package com.cheng.ComputerRoomSystem.goods;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface GoodsStockRecordRepository extends JpaRepository<GoodsStockRecord, Long> {

    Page<GoodsStockRecord> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("""
            SELECT r FROM GoodsStockRecord r
            WHERE (:goodsId IS NULL OR r.goodsId = :goodsId)
              AND (:start IS NULL OR r.businessDate >= :start)
              AND (:end IS NULL OR r.businessDate <= :end)
            ORDER BY r.id DESC
            """)
    Page<GoodsStockRecord> search(@Param("goodsId") Long goodsId,
                                  @Param("start") LocalDate start,
                                  @Param("end") LocalDate end,
                                  Pageable pageable);
}
