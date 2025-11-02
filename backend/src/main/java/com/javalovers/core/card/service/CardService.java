package com.javalovers.core.card.service;

import com.javalovers.common.specification.SearchCriteria;
import com.javalovers.common.specification.SpecificationHelper;
import com.javalovers.core.card.dto.request.CardFilterDTO;
import com.javalovers.core.card.dto.request.CardFormDTO;
import com.javalovers.core.card.dto.response.CardDTO;
import com.javalovers.core.card.entity.Card;
import com.javalovers.core.card.mapper.CardCreateMapper;
import com.javalovers.core.card.mapper.CardDTOMapper;
import com.javalovers.core.card.mapper.CardUpdateMapper;
import com.javalovers.core.card.repository.CardRepository;
import com.javalovers.core.card.specification.CardSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final CardCreateMapper cardCreateMapper;
    private final CardDTOMapper cardDTOMapper;
    private final CardUpdateMapper cardUpdateMapper;

    public Card generateCard(CardFormDTO cardFormDTO) {
        return cardCreateMapper.convert(cardFormDTO);
    }

    public void save (Card card) {
        cardRepository.save(card);
    }

    public CardDTO generateCardDTO(Card card) {
        return cardDTOMapper.convert(card);
    }

    public Card getOrNull(Long id){
        return cardRepository.findById(id).orElse(null);
    }

    public void updateCard(Card card, CardFormDTO cardFormDTO) {
        cardUpdateMapper.update(card, cardFormDTO);
    }

    public void delete(Card card) {
        cardRepository.delete(card);
    }

    public List<Card> list(CardFilterDTO cardFilterDTO) {
        Specification<Card> cardSpecification = generateSpecification(cardFilterDTO);
        return cardRepository.findAll(cardSpecification);
    }

    public Page<Card> list(Pageable pageable, CardFilterDTO cardFilterDTO) {
        Specification<Card> cardSpecification = generateSpecification(cardFilterDTO);
        return cardRepository.findAll(cardSpecification, pageable);
    }

    private Specification<Card> generateSpecification(CardFilterDTO cardFilterDTO) {
        SearchCriteria<String> uniqueNumberCriteria = SpecificationHelper.generateInnerLikeCriteria("uniqueNumber", cardFilterDTO.uniqueNumber());
        SearchCriteria<Long> beneficiaryIdCriteria = SpecificationHelper.generateEqualsCriteria("beneficiaryId", cardFilterDTO.beneficiaryId());

        Specification<Card> uniqueNumberSpecification = new CardSpecification(uniqueNumberCriteria);
        Specification<Card> beneficiaryIdSpecification = new CardSpecification(beneficiaryIdCriteria);

        return Specification.where(uniqueNumberSpecification)
                .and(beneficiaryIdSpecification);
    }

    public Page<CardDTO> generateCardDTOPage(Page<Card> cardPage) {
        return cardPage.map(this::generateCardDTO);
    }

    public List<CardDTO> generateCardDTOList(List<Card> cardList) {
        return cardList.stream().map(cardDTOMapper::convert).toList();
    }
}
