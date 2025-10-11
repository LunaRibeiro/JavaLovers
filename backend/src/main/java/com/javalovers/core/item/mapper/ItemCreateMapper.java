package com.javalovers.core.item.mapper;

import com.javalovers.core.category.domain.entity.Category;
import com.javalovers.core.category.mapper.CategoryDTOMapper;
import com.javalovers.core.item.domain.dto.request.ItemFormDTO;
import com.javalovers.core.item.domain.entity.Item;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
public class ItemCreateMapper {

    public Item convert(ItemFormDTO itemFormDTO, Category category){
        Item item = new Item();
        item.setDescription(itemFormDTO.description());
        item.setStockQuantity(itemFormDTO.stockQuantity());
        item.setTagCode(itemFormDTO.tagCode());
        item.setCategory(category);

        return item;
    }
}
