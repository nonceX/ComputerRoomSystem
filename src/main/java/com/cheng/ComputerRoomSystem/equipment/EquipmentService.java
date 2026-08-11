package com.cheng.ComputerRoomSystem.equipment;

import com.cheng.ComputerRoomSystem.common.BusinessException;
import com.cheng.ComputerRoomSystem.common.PageResult;
import com.cheng.ComputerRoomSystem.equipment.dto.EquipmentCreateRequest;
import com.cheng.ComputerRoomSystem.equipment.dto.EquipmentResponse;
import com.cheng.ComputerRoomSystem.equipment.dto.EquipmentStatisticsResponse;
import com.cheng.ComputerRoomSystem.equipment.dto.EquipmentStockRecordResponse;
import com.cheng.ComputerRoomSystem.equipment.dto.EquipmentStockRequest;
import com.cheng.ComputerRoomSystem.equipment.dto.EquipmentUpdateRequest;
import com.cheng.ComputerRoomSystem.security.AuthUser;
import com.cheng.ComputerRoomSystem.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EquipmentService {

    private static final String STATUS_NORMAL = "NORMAL";
    private static final String STATUS_REPAIR = "REPAIR";
    private static final String STATUS_SCRAPPED = "SCRAPPED";
    private static final Set<String> EDITABLE_STATUSES = Set.of(STATUS_NORMAL, STATUS_REPAIR);

    private final EquipmentRepository equipmentRepository;
    private final EquipmentStockRecordRepository recordRepository;

    public PageResult<EquipmentResponse> search(String name, String status, int page, int size) {
        String normalizedStatus = blankToNull(status);
        if (normalizedStatus != null && !isKnownStatus(normalizedStatus)) {
            throw new BusinessException("设备状态不正确");
        }

        Pageable pageable = PageRequest.of(safePage(page), safeSize(size));
        return PageResult.of(
                equipmentRepository.search(blankToNull(name), normalizedStatus, pageable),
                EquipmentResponse::from
        );
    }

    public EquipmentResponse getById(Long id) {
        return EquipmentResponse.from(findEntity(id));
    }

    @Transactional
    public EquipmentResponse create(EquipmentCreateRequest request) {
        if (equipmentRepository.existsByEquipmentNo(request.getEquipmentNo())) {
            throw new BusinessException("设备编号已存在：" + request.getEquipmentNo());
        }

        Equipment equipment = new Equipment();
        equipment.setEquipmentNo(request.getEquipmentNo());
        equipment.setName(request.getName());
        equipment.setModel(blankToNull(request.getModel()));
        equipment.setQuantity(request.getQuantity());
        equipment.setStatus(request.getStatus());
        equipment.setLocation(request.getLocation());

        AuthUser operator = SecurityUtils.getCurrentUser();
        equipment.setCreatedBy(operator.id());
        Equipment saved = equipmentRepository.save(equipment);

        if (saved.getQuantity() > 0) {
            saveRecord(saved, saved.getQuantity(), true, LocalDate.now(), operator, "设备登记初始库存");
        }
        return EquipmentResponse.from(saved);
    }

    @Transactional
    public EquipmentResponse update(Long id, EquipmentUpdateRequest request) {
        Equipment equipment = findEntity(id);
        if (STATUS_SCRAPPED.equals(equipment.getStatus())) {
            throw new BusinessException("已报废设备不能编辑");
        }
        if (equipmentRepository.existsByEquipmentNoAndIdNot(request.getEquipmentNo(), id)) {
            throw new BusinessException("设备编号已被其他设备使用：" + request.getEquipmentNo());
        }

        equipment.setEquipmentNo(request.getEquipmentNo());
        equipment.setName(request.getName());
        equipment.setModel(blankToNull(request.getModel()));
        equipment.setStatus(request.getStatus());
        equipment.setLocation(request.getLocation());
        return EquipmentResponse.from(equipmentRepository.save(equipment));
    }

    public PageResult<EquipmentStockRecordResponse> stockRecords(Long equipmentId, int page, int size) {
        Pageable pageable = PageRequest.of(safePage(page), safeSize(size));
        Page<EquipmentStockRecord> records = equipmentId == null
                ? recordRepository.findAllByOrderByIdDesc(pageable)
                : recordRepository.findByEquipmentIdOrderByIdDesc(equipmentId, pageable);
        return PageResult.of(records, EquipmentStockRecordResponse::from);
    }

    public EquipmentStatisticsResponse statistics() {
        return new EquipmentStatisticsResponse(
                equipmentRepository.countByStatus(STATUS_NORMAL),
                equipmentRepository.countByStatus(STATUS_REPAIR),
                equipmentRepository.countByStatus(STATUS_SCRAPPED),
                equipmentRepository.count()
        );
    }

    @Transactional
    public void changeStock(Long id, EquipmentStockRequest request, boolean stockIn) {
        Equipment equipment = findEntity(id);
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new BusinessException("数量必须大于 0");
        }
        if (STATUS_SCRAPPED.equals(equipment.getStatus())) {
            throw new BusinessException("已报废设备不能出入库");
        }
        if (!stockIn && equipment.getQuantity() < request.getQuantity()) {
            throw new BusinessException("库存不足，当前库存 " + equipment.getQuantity());
        }

        int delta = stockIn ? request.getQuantity() : -request.getQuantity();
        equipment.setQuantity(equipment.getQuantity() + delta);
        equipmentRepository.save(equipment);

        AuthUser operator = SecurityUtils.getCurrentUser();
        LocalDate businessDate = request.getBusinessDate() == null
                ? LocalDate.now()
                : request.getBusinessDate();
        saveRecord(equipment, request.getQuantity(), stockIn, businessDate, operator, request.getRemark());
    }

    @Transactional
    public void scrap(Long id) {
        Equipment equipment = findEntity(id);
        if (STATUS_SCRAPPED.equals(equipment.getStatus())) {
            throw new BusinessException("设备已经报废");
        }
        if (equipment.getQuantity() != 0) {
            throw new BusinessException("库存不为 0 的设备不能报废，请先完成出库处理");
        }
        equipment.setStatus(STATUS_SCRAPPED);
        equipmentRepository.save(equipment);
    }

    private Equipment findEntity(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new BusinessException("设备不存在，id=" + id));
    }

    private void saveRecord(Equipment equipment, int quantity, boolean stockIn,
                            LocalDate businessDate, AuthUser operator, String remark) {
        EquipmentStockRecord record = new EquipmentStockRecord();
        record.setEquipmentId(equipment.getId());
        record.setEquipmentName(equipment.getName());
        record.setRecordType(stockIn ? "IN" : "OUT");
        record.setQuantity(quantity);
        record.setBusinessDate(businessDate);
        record.setOperatorId(operator.id());
        record.setOperatorName(operator.username());
        record.setRemark(blankToNull(remark));
        recordRepository.save(record);
    }

    private boolean isKnownStatus(String status) {
        return EDITABLE_STATUSES.contains(status) || STATUS_SCRAPPED.equals(status);
    }

    private int safePage(int page) {
        return Math.max(page, 1) - 1;
    }

    private int safeSize(int size) {
        return Math.max(1, Math.min(size, 100));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
