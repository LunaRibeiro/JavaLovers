package com.javalovers.core.item.mapper;

import com.javalovers.core.category.domain.dto.response.CategoryDTO;
import com.javalovers.core.category.domain.entity.Category;
import com.javalovers.core.category.mapper.CategoryDTOMapper;
import com.javalovers.core.item.domain.dto.response.ItemDTO;
import com.javalovers.core.item.domain.entity.Item;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ItemDTOMapper {

    private final CategoryDTOMapper categoryDTOMapper;

    public ItemDTO convert(Item item){
        if(item == null) return null;
        return new ItemDTO(
                item.getItemId(),
                item.getDescription(),
                item.getStockQuantity(),
                item.getTagCode(),
                categoryDTOMapper.convert(item.getCategoryId())
        );
    }
}
