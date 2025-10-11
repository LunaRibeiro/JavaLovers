package com.javalovers.core.item.domain.dto.request;

public record ItemFormDTO(
        String description,
        Long stockQuantity,
        String tagCode,
        Long categoryId
) {
}
