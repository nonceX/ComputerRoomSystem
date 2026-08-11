package com.cheng.ComputerRoomSystem.goods.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class GoodsStockRequest {

    @NotNull(message = "数量不能为空")
    @Positive(message = "数量必须大于 0")
    private Integer quantity;

    @PastOrPresent(message = "业务日期不能晚于今天")
    private LocalDate businessDate;

    @Size(max = 500, message = "备注不能超过 500 字")
    private String remark;
}
