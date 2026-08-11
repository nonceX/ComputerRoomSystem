package com.cheng.ComputerRoomSystem.goods;

import com.cheng.ComputerRoomSystem.common.PageResult;
import com.cheng.ComputerRoomSystem.common.Result;
import com.cheng.ComputerRoomSystem.goods.dto.GoodsCreateRequest;
import com.cheng.ComputerRoomSystem.goods.dto.GoodsResponse;
import com.cheng.ComputerRoomSystem.goods.dto.GoodsStockRecordResponse;
import com.cheng.ComputerRoomSystem.goods.dto.GoodsStockRequest;
import com.cheng.ComputerRoomSystem.goods.dto.GoodsUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/goods")
@RequiredArgsConstructor
public class GoodsController {

    private final GoodsService goodsService;

    @PreAuthorize("hasAuthority('goods:view')")
    @GetMapping
    public Result<PageResult<GoodsResponse>> list(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return Result.success(goodsService.search(name, category, page, size));
    }

    @PreAuthorize("hasAuthority('goods:view')")
    @GetMapping("/stock-records")
    public Result<PageResult<GoodsStockRecordResponse>> stockRecords(
            @RequestParam(name = "goodsId", required = false) Long goodsId,
            @RequestParam(name = "start", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(name = "end", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return Result.success(goodsService.stockRecords(goodsId, start, end, page, size));
    }

    @PreAuthorize("hasAuthority('goods:view')")
    @GetMapping("/warnings")
    public Result<List<GoodsResponse>> warnings() {
        return Result.success(goodsService.warnings());
    }

    @PreAuthorize("hasAuthority('goods:view')")
    @GetMapping("/{id}")
    public Result<GoodsResponse> getById(@PathVariable("id") Long id) {
        return Result.success(goodsService.getById(id));
    }

    @PreAuthorize("hasAuthority('goods:add')")
    @PostMapping
    public Result<GoodsResponse> create(@Valid @RequestBody GoodsCreateRequest request) {
        return Result.success(goodsService.create(request));
    }

    @PreAuthorize("hasAuthority('goods:edit')")
    @PutMapping("/{id}")
    public Result<GoodsResponse> update(
            @PathVariable("id") Long id,
            @Valid @RequestBody GoodsUpdateRequest request) {
        return Result.success(goodsService.update(id, request));
    }

    @PreAuthorize("hasAuthority('goods:delete')")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        goodsService.delete(id);
        return Result.success();
    }

    @PreAuthorize("hasAuthority('goods:stock')")
    @PostMapping("/{id}/stock-in")
    public Result<Void> stockIn(
            @PathVariable("id") Long id,
            @Valid @RequestBody GoodsStockRequest request) {
        goodsService.stockIn(id, request);
        return Result.success();
    }

    @PreAuthorize("hasAuthority('goods:stock')")
    @PostMapping("/{id}/stock-out")
    public Result<Void> stockOut(
            @PathVariable("id") Long id,
            @Valid @RequestBody GoodsStockRequest request) {
        goodsService.stockOut(id, request);
        return Result.success();
    }

    @PreAuthorize("hasAuthority('goods:stock')")
    @PostMapping("/{id}/stock-return")
    public Result<Void> stockReturn(
            @PathVariable("id") Long id,
            @Valid @RequestBody GoodsStockRequest request) {
        goodsService.stockReturn(id, request);
        return Result.success();
    }
}
