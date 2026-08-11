package com.cheng.ComputerRoomSystem.equipment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipmentStockRecordRepository extends JpaRepository<EquipmentStockRecord, Long> {
    Page<EquipmentStockRecord> findByEquipmentIdOrderByIdDesc(Long equipmentId, Pageable pageable);

    Page<EquipmentStockRecord> findAllByOrderByIdDesc(Pageable pageable);

    Page<EquipmentStockRecord> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
