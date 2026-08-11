package com.cheng.ComputerRoomSystem.goods;

import com.cheng.ComputerRoomSystem.common.BusinessException;
import com.cheng.ComputerRoomSystem.goods.dto.GoodsResponse;
import com.cheng.ComputerRoomSystem.goods.dto.GoodsStockRequest;
import com.cheng.ComputerRoomSystem.security.AuthUser;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GoodsServiceTests {

    @Mock
    private GoodsRepository goodsRepository;

    @Mock
    private GoodsStockRecordRepository recordRepository;

    @InjectMocks
    private GoodsService goodsService;

    @BeforeEach
    void authenticateOperator() {
        AuthUser operator = new AuthUser(7L, "admin", "admin");
        var authentication = new UsernamePasswordAuthenticationToken(operator, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void clearAuthentication() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void stockInUpdatesStockAndCreatesRecordFromJwt() {
        Goods goods = goods(1L, 2, 5);
        GoodsStockRequest request = stockRequest(3);
        when(goodsRepository.findById(1L)).thenReturn(Optional.of(goods));

        goodsService.stockIn(1L, request);

        assertEquals(5, goods.getStock());
        verify(goodsRepository).save(goods);
        ArgumentCaptor<GoodsStockRecord> captor = ArgumentCaptor.forClass(GoodsStockRecord.class);
        verify(recordRepository).save(captor.capture());
        GoodsStockRecord record = captor.getValue();
        assertEquals("IN", record.getRecordType());
        assertEquals(3, record.getQuantity());
        assertEquals(7L, record.getOperatorId());
        assertEquals("admin", record.getOperatorName());
        assertEquals(LocalDate.now(), record.getBusinessDate());
    }

    @Test
    void stockOutUpdatesStockAndCreatesOutRecord() {
        Goods goods = goods(1L, 5, 2);
        when(goodsRepository.findById(1L)).thenReturn(Optional.of(goods));

        goodsService.stockOut(1L, stockRequest(3));

        assertEquals(2, goods.getStock());
        ArgumentCaptor<GoodsStockRecord> captor = ArgumentCaptor.forClass(GoodsStockRecord.class);
        verify(recordRepository).save(captor.capture());
        assertEquals("OUT", captor.getValue().getRecordType());
        assertEquals(3, captor.getValue().getQuantity());
    }

    @Test
    void stockOutOverCurrentStockChangesNothing() {
        Goods goods = goods(1L, 2, 1);
        when(goodsRepository.findById(1L)).thenReturn(Optional.of(goods));

        BusinessException error = assertThrows(
                BusinessException.class,
                () -> goodsService.stockOut(1L, stockRequest(3))
        );

        assertEquals("库存不足，当前库存 2", error.getMessage());
        assertEquals(2, goods.getStock());
        verify(goodsRepository, never()).save(any());
        verify(recordRepository, never()).save(any());
    }

    @Test
    void stockReturnIncreasesStockAndCreatesReturnRecord() {
        Goods goods = goods(1L, 2, 5);
        when(goodsRepository.findById(1L)).thenReturn(Optional.of(goods));

        goodsService.stockReturn(1L, stockRequest(3));

        assertEquals(5, goods.getStock());
        ArgumentCaptor<GoodsStockRecord> captor = ArgumentCaptor.forClass(GoodsStockRecord.class);
        verify(recordRepository).save(captor.capture());
        assertEquals("RETURN", captor.getValue().getRecordType());
        assertEquals(3, captor.getValue().getQuantity());
    }

    @Test
    void goodsWithStockCannotBeDeleted() {
        Goods goods = goods(1L, 1, 5);
        when(goodsRepository.findById(1L)).thenReturn(Optional.of(goods));

        BusinessException error = assertThrows(BusinessException.class, () -> goodsService.delete(1L));

        assertEquals("库存不为 0 的耗材不能删除，请先完成出库处理", error.getMessage());
        verify(goodsRepository, never()).delete(any());
    }

    @Test
    void warningsComeFromRepositoryQuery() {
        Goods goods = goods(1L, 2, 5);
        when(goodsRepository.findWarnings()).thenReturn(List.of(goods));

        List<GoodsResponse> warnings = goodsService.warnings();

        assertEquals(1, warnings.size());
        assertEquals(true, warnings.getFirst().lowStock());
        verify(goodsRepository).findWarnings();
        verify(goodsRepository, never()).findAll();
    }

    private Goods goods(Long id, int stock, int safeStock) {
        Goods goods = new Goods();
        goods.setId(id);
        goods.setGoodsNo("HC-001");
        goods.setName("网线");
        goods.setCategory("网络耗材");
        goods.setUnit("根");
        goods.setStock(stock);
        goods.setSafeStock(safeStock);
        return goods;
    }

    private GoodsStockRequest stockRequest(int quantity) {
        GoodsStockRequest request = new GoodsStockRequest();
        request.setQuantity(quantity);
        return request;
    }
}
