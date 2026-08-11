package com.cheng.ComputerRoomSystem.equipment.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EquipmentCreateRequest {

    @NotBlank(message = "设备编号不能为空")
    @Size(max = 50, message = "设备编号不能超过 50 个字符")
    private String equipmentNo;

    @NotBlank(message = "设备名称不能为空")
    @Size(max = 100, message = "设备名称不能超过 100 个字符")
    private String name;

    @Size(max = 100, message = "设备型号不能超过 100 个字符")
    private String model;

    @NotNull(message = "初始库存不能为空")
    @Min(value = 0, message = "初始库存不能小于 0")
    private Integer quantity;

    @NotBlank(message = "设备状态不能为空")
    @Pattern(regexp = "NORMAL|REPAIR", message = "新设备状态只能是正常或维修")
    private String status;

    @NotBlank(message = "设备位置不能为空")
    @Size(max = 100, message = "设备位置不能超过 100 个字符")
    private String location;
}
