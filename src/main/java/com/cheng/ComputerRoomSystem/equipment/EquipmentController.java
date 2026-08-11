package com.cheng.ComputerRoomSystem.equipment;

import com.cheng.ComputerRoomSystem.common.PageResult;
import com.cheng.ComputerRoomSystem.common.Result;
import com.cheng.ComputerRoomSystem.equipment.dto.EquipmentCreateRequest;
import com.cheng.ComputerRoomSystem.equipment.dto.EquipmentResponse;
import com.cheng.ComputerRoomSystem.equipment.dto.EquipmentStatisticsResponse;
import com.cheng.ComputerRoomSystem.equipment.dto.EquipmentStockRecordResponse;
import com.cheng.ComputerRoomSystem.equipment.dto.EquipmentStockRequest;
import com.cheng.ComputerRoomSystem.equipment.dto.EquipmentUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;

    @PreAuthorize("hasAuthority('equipment:view')")
    @GetMapping
    public Result<PageResult<EquipmentResponse>> list(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return Result.success(equipmentService.search(name, status, page, size));
    }

    @PreAuthorize("hasAuthority('equipment:view')")
    @GetMapping("/stock-records")
    public Result<PageResult<EquipmentStockRecordResponse>> stockRecords(
            @RequestParam(name = "equipmentId", required = false) Long equipmentId,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        return Result.success(equipmentService.stockRecords(equipmentId, page, size));
    }

    @PreAuthorize("hasAuthority('equipment:view')")
    @GetMapping("/statistics")
    public Result<EquipmentStatisticsResponse> statistics() {
        return Result.success(equipmentService.statistics());
    }

    @PreAuthorize("hasAuthority('equipment:view')")
    @GetMapping("/{id}")
    public Result<EquipmentResponse> getById(@PathVariable("id") Long id) {
        return Result.success(equipmentService.getById(id));
    }

    @PreAuthorize("hasAuthority('equipment:add')")
    @PostMapping
    public Result<EquipmentResponse> create(@Valid @RequestBody EquipmentCreateRequest request) {
        return Result.success(equipmentService.create(request));
    }

    @PreAuthorize("hasAuthority('equipment:edit')")
    @PutMapping("/{id}")
    public Result<EquipmentResponse> update(
            @PathVariable("id") Long id,
            @Valid @RequestBody EquipmentUpdateRequest request) {
        return Result.success(equipmentService.update(id, request));
    }

    @PreAuthorize("hasAuthority('equipment:delete')")
    @PutMapping("/{id}/scrap")
    public Result<Void> scrap(@PathVariable("id") Long id) {
        equipmentService.scrap(id);
        return Result.success();
    }

    @PreAuthorize("hasAuthority('equipment:stock')")
    @PostMapping("/{id}/stock-in")
    public Result<Void> stockIn(
            @PathVariable("id") Long id,
            @Valid @RequestBody EquipmentStockRequest request) {
        equipmentService.changeStock(id, request, true);
        return Result.success();
    }

    @PreAuthorize("hasAuthority('equipment:stock')")
    @PostMapping("/{id}/stock-out")
    public Result<Void> stockOut(
            @PathVariable("id") Long id,
            @Valid @RequestBody EquipmentStockRequest request) {
        equipmentService.changeStock(id, request, false);
        return Result.success();
    }
}
