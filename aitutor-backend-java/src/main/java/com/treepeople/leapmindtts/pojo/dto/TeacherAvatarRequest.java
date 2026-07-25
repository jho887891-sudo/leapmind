package com.treepeople.leapmindtts.pojo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TeacherAvatarRequest {
    @NotBlank
    private String avatarCode;
    @NotBlank
    private String name;
    private String description;
    @NotBlank
    private String modelUrl;
    private String thumbnailUrl;
    @NotBlank
    private String voiceType;
    private String accent;
    private Boolean enabled = true;
    private Integer sortOrder = 0;
}
