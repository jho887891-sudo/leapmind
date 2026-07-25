package com.treepeople.leapmindtts.pojo.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VirtualTeacherTtsRequest {
    private String courseId;
    @NotBlank
    private String text;
    private String voiceType;
    @DecimalMin("0.50")
    @DecimalMax("2.00")
    private Double speed = 1.0;
}
