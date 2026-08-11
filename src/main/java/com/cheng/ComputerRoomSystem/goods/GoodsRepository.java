package com.cheng.ComputerRoomSystem.goods;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GoodsRepository extends JpaRepository<Goods, Long> {
    boolean existsByGoodsNo(String goodsNo);

    boolean existsByGoodsNoAndIdNot(String goodsNo, Long id);

    @Query("""
            SELECT g FROM Goods g
            WHERE (:name IS NULL OR g.name LIKE %:name%)
              AND (:category IS NULL OR g.category = :category)
            ORDER BY g.id DESC
            """)
    Page<Goods> search(@Param("name") String name,
                       @Param("category") String category,
                       Pageable pageable);

    @Query("SELECT g FROM Goods g WHERE g.stock < g.safeStock ORDER BY g.stock ASC")
    List<Goods> findWarnings();

    @Query("SELECT COUNT(g) FROM Goods g WHERE g.stock < g.safeStock")
    long countWarnings();
}
