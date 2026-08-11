package com.cheng.ComputerRoomSystem.goods.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoodsCreateRequest {

    @NotBlank(message = "耗材编号不能为空")
    @Size(max = 50, message = "耗材编号不能超过 50 个字符")
    private String goodsNo;

    @NotBlank(message = "耗材名称不能为空")
    @Size(max = 100, message = "耗材名称不能超过 100 个字符")
    private String name;

    @NotBlank(message = "耗材分类不能为空")
    @Size(max = 50, message = "耗材分类不能超过 50 个字符")
    private String category;

    @NotBlank(message = "计量单位不能为空")
    @Size(max = 20, message = "计量单位不能超过 20 个字符")
    private String unit;

    @NotNull(message = "初始库存不能为空")
    @Min(value = 0, message = "初始库存不能小于 0")
    private Integer stock;

    @NotNull(message = "安全库存不能为空")
    @Min(value = 0, message = "安全库存不能小于 0")
    private Integer safeStock;
}
