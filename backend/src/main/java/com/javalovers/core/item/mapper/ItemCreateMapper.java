package com.javalovers.core.item.mapper;

import com.javalovers.core.category.domain.entity.Category;
import com.javalovers.core.item.domain.dto.request.ItemFormDTO;
import com.javalovers.core.item.domain.entity.Item;
import org.springframework.stereotype.Service;

@Service
public class ItemCreateMapper {

    public Item convert(ItemFormDTO itemFormDTO, Category category){
        Item item = new Item();
        item.setDescription(itemFormDTO.description());
        item.setStockQuantity(itemFormDTO.stockQuantity());
        item.setTagCode(itemFormDTO.tagCode());
        item.setCategoryId(category);

        return item;
    }
}
