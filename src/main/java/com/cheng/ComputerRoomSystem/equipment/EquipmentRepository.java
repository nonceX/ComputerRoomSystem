package com.cheng.ComputerRoomSystem.equipment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    boolean existsByEquipmentNo(String equipmentNo);

    boolean existsByEquipmentNoAndIdNot(String equipmentNo, Long id);

    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(e.quantity), 0) FROM Equipment e WHERE e.status <> 'SCRAPPED'")
    long sumAvailableQuantity();

    @Query("""
            SELECT e FROM Equipment e
            WHERE (:name IS NULL OR e.name LIKE %:name%)
              AND (:status IS NULL OR e.status = :status)
            ORDER BY e.id DESC
            """)
    Page<Equipment> search(@Param("name") String name,
                           @Param("status") String status,
                           Pageable pageable);
}
