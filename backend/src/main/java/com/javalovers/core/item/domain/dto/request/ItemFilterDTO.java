package com.javalovers.core.item.domain.dto.request;

import com.javalovers.core.category.domain.dto.response.CategoryDTO;

public record ItemFilterDTO(
        String description,
        Long stockQuantity,
        String tagCode,
        CategoryDTO category
) {
}
