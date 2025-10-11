package com.javalovers.core.item.service;

import com.javalovers.common.specification.SearchCriteria;
import com.javalovers.common.specification.SpecificationHelper;
import com.javalovers.core.category.domain.entity.Category;
import com.javalovers.core.item.domain.dto.request.ItemFilterDTO;
import com.javalovers.core.item.domain.dto.request.ItemFormDTO;
import com.javalovers.core.item.domain.dto.response.ItemDTO;
import com.javalovers.core.item.domain.entity.Item;
import com.javalovers.core.item.mapper.ItemCreateMapper;
import com.javalovers.core.item.mapper.ItemDTOMapper;
import com.javalovers.core.item.mapper.ItemUpdateMapper;
import com.javalovers.core.item.repository.ItemRepository;
import com.javalovers.core.item.specification.ItemSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final ItemCreateMapper itemCreateMapper;
    private final ItemDTOMapper itemDTOMapper;
    private final ItemUpdateMapper itemUpdateMapper;
    private Category category;

    public Item generateItem(ItemFormDTO itemFormDTO) {
        return itemCreateMapper.convert(itemFormDTO, category);
    }

    public void save (Item item) {
        itemRepository.save(item);
    }

    public ItemDTO generateItemDTO(Item item) {
        return itemDTOMapper.convert(item);
    }

    public Item getOrNull(Long id){
        return itemRepository.findById(id).orElse(null);
    }

    public void updateItem(Item item, ItemFormDTO itemFormDTO) {
        itemUpdateMapper.update(item, itemFormDTO);
    }

    public void delete(Item item) {
        itemRepository.delete(item);
    }

    public List<Item> list(ItemFilterDTO itemFilterDTO) {
        Specification<Item> itemSpecification = generateSpecification(itemFilterDTO);
        return itemRepository.findAll(itemSpecification);
    }

    public Page<Item> list(Pageable pageable, ItemFilterDTO itemFilterDTO) {
        Specification<Item> itemSpecification = generateSpecification(itemFilterDTO);
        return itemRepository.findAll(itemSpecification, pageable);
    }

    private Specification<Item> generateSpecification(ItemFilterDTO itemFilterDTO) {
        SearchCriteria<String> descriptionCriteria = SpecificationHelper.generateInnerLikeCriteria("description", itemFilterDTO.description());
        SearchCriteria<Long> stockQuantityCriteria = SpecificationHelper.generateEqualsCriteria("stockQuantity", itemFilterDTO.stockQuantity());
        SearchCriteria<String> tagCodeCriteria = SpecificationHelper.generateInnerLikeCriteria("tagCode", itemFilterDTO.tagCode());

        Specification<Item> descriptionSpecification = new ItemSpecification(descriptionCriteria);
        Specification<Item> stockQuantitySpecification = new ItemSpecification(stockQuantityCriteria);
        Specification<Item> tagCodeSpecification = new ItemSpecification(tagCodeCriteria);

        return Specification.where(descriptionSpecification)
                .and(stockQuantitySpecification)
                .and(tagCodeSpecification);
    }

    public Page<ItemDTO> generateItemDTOPage(Page<Item> itemPage) {
        return itemPage.map(this::generateItemDTO);
    }

    public List<ItemDTO> generateItemDTOList(List<Item> itemList) {
        return itemList.stream().map(itemDTOMapper::convert).toList();
    }

}
