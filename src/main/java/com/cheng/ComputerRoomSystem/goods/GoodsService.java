package com.cheng.ComputerRoomSystem.goods;

import com.cheng.ComputerRoomSystem.common.BusinessException;
import com.cheng.ComputerRoomSystem.common.PageResult;
import com.cheng.ComputerRoomSystem.goods.dto.GoodsCreateRequest;
import com.cheng.ComputerRoomSystem.goods.dto.GoodsResponse;
import com.cheng.ComputerRoomSystem.goods.dto.GoodsStockRecordResponse;
import com.cheng.ComputerRoomSystem.goods.dto.GoodsStockRequest;
import com.cheng.ComputerRoomSystem.goods.dto.GoodsUpdateRequest;
import com.cheng.ComputerRoomSystem.security.AuthUser;
import com.cheng.ComputerRoomSystem.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GoodsService {

    private final GoodsRepository goodsRepository;
    private final GoodsStockRecordRepository recordRepository;

    public PageResult<GoodsResponse> search(String name, String category, int page, int size) {
        Pageable pageable = PageRequest.of(safePage(page), safeSize(size));
        return PageResult.of(
                goodsRepository.search(blankToNull(name), blankToNull(category), pageable),
                GoodsResponse::from
        );
    }

    public GoodsResponse getById(Long id) {
        return GoodsResponse.from(findEntity(id));
    }

    @Transactional
    public GoodsResponse create(GoodsCreateRequest request) {
        if (goodsRepository.existsByGoodsNo(request.getGoodsNo())) {
            throw new BusinessException("耗材编号已存在：" + request.getGoodsNo());
        }

        Goods goods = new Goods();
        goods.setGoodsNo(request.getGoodsNo());
        goods.setName(request.getName());
        goods.setCategory(request.getCategory());
        goods.setUnit(request.getUnit());
        goods.setStock(request.getStock());
        goods.setSafeStock(request.getSafeStock());

        AuthUser operator = SecurityUtils.getCurrentUser();
        goods.setCreatedBy(operator.id());
        Goods saved = goodsRepository.save(goods);

        if (saved.getStock() > 0) {
            saveRecord(saved, saved.getStock(), "IN", LocalDate.now(), operator, "耗材登记初始库存");
        }
        return GoodsResponse.from(saved);
    }

    @Transactional
    public GoodsResponse update(Long id, GoodsUpdateRequest request) {
        Goods goods = findEntity(id);
        if (goodsRepository.existsByGoodsNoAndIdNot(request.getGoodsNo(), id)) {
            throw new BusinessException("耗材编号已被其他耗材使用：" + request.getGoodsNo());
        }

        goods.setGoodsNo(request.getGoodsNo());
        goods.setName(request.getName());
        goods.setCategory(request.getCategory());
        goods.setUnit(request.getUnit());
        goods.setSafeStock(request.getSafeStock());
        return GoodsResponse.from(goodsRepository.save(goods));
    }

    @Transactional
    public void delete(Long id) {
        Goods goods = findEntity(id);
        if (goods.getStock() != 0) {
            throw new BusinessException("库存不为 0 的耗材不能删除，请先完成出库处理");
        }
        goodsRepository.delete(goods);
    }

    @Transactional
    public void stockIn(Long goodsId, GoodsStockRequest request) {
        changeStock(goodsId, request, true, "IN");
    }

    @Transactional
    public void stockOut(Long goodsId, GoodsStockRequest request) {
        changeStock(goodsId, request, false, "OUT");
    }

    @Transactional
    public void stockReturn(Long goodsId, GoodsStockRequest request) {
        changeStock(goodsId, request, true, "RETURN");
    }

    public PageResult<GoodsStockRecordResponse> stockRecords(
            Long goodsId, LocalDate start, LocalDate end, int page, int size) {
        if (start != null && end != null && start.isAfter(end)) {
            throw new BusinessException("开始日期不能晚于结束日期");
        }
        Pageable pageable = PageRequest.of(safePage(page), safeSize(size));
        return PageResult.of(
                recordRepository.search(goodsId, start, end, pageable),
                GoodsStockRecordResponse::from
        );
    }

    public List<GoodsResponse> warnings() {
        return goodsRepository.findWarnings().stream()
                .map(GoodsResponse::from)
                .toList();
    }

    public long countWarnings() {
        return goodsRepository.countWarnings();
    }

    private void changeStock(Long goodsId, GoodsStockRequest request,
                             boolean stockIn, String recordType) {
        Goods goods = findEntity(goodsId);
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            String action = switch (recordType) {
                case "RETURN" -> "归还";
                case "OUT" -> "出库";
                default -> "入库";
            };
            throw new BusinessException(action + "数量必须大于 0");
        }
        if (!stockIn && goods.getStock() < request.getQuantity()) {
            throw new BusinessException("库存不足，当前库存 " + goods.getStock());
        }

        int delta = stockIn ? request.getQuantity() : -request.getQuantity();
        goods.setStock(goods.getStock() + delta);
        goodsRepository.save(goods);

        AuthUser operator = SecurityUtils.getCurrentUser();
        LocalDate businessDate = request.getBusinessDate() == null
                ? LocalDate.now()
                : request.getBusinessDate();
        saveRecord(goods, request.getQuantity(), recordType, businessDate, operator, request.getRemark());
    }

    private Goods findEntity(Long id) {
        return goodsRepository.findById(id)
                .orElseThrow(() -> new BusinessException("耗材不存在，id=" + id));
    }

    private void saveRecord(Goods goods, int quantity, String recordType,
                            LocalDate businessDate, AuthUser operator, String remark) {
        GoodsStockRecord record = new GoodsStockRecord();
        record.setGoodsId(goods.getId());
        record.setGoodsName(goods.getName());
        record.setRecordType(recordType);
        record.setQuantity(quantity);
        record.setBusinessDate(businessDate);
        record.setOperatorId(operator.id());
        record.setOperatorName(operator.username());
        record.setRemark(blankToNull(remark));
        recordRepository.save(record);
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
