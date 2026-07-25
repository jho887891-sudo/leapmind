package com.treepeople.leapmindtts.pojo.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TeacherPreferenceRequest {
    @NotBlank
    private String avatarId;
    private String voiceType;
    @DecimalMin("0.50")
    @DecimalMax("2.00")
    private BigDecimal speed = BigDecimal.ONE;
}
