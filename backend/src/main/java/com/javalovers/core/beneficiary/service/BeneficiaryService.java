package com.javalovers.core.beneficiary.service;

import com.javalovers.common.exception.EntityNotFoundException;
import com.javalovers.common.specification.SearchCriteria;
import com.javalovers.common.specification.SpecificationHelper;
import com.javalovers.core.beneficiary.domain.dto.request.BeneficiaryFilterDTO;
import com.javalovers.core.beneficiary.domain.dto.request.BeneficiaryFormDTO;
import com.javalovers.core.beneficiary.domain.dto.response.BeneficiaryDTO;
import com.javalovers.core.beneficiary.domain.entity.Beneficiary;
import com.javalovers.core.beneficiary.mapper.BeneficiaryCreateMapper;
import com.javalovers.core.beneficiary.mapper.BeneficiaryDTOMapper;
import com.javalovers.core.beneficiary.mapper.BeneficiaryUpdateMapper;
import com.javalovers.core.beneficiary.repository.BeneficiaryRepository;
import com.javalovers.core.beneficiary.specification.BeneficiarySpecification;
import com.javalovers.core.beneficiarystatus.BeneficiaryStatus;
import com.javalovers.core.appuser.domain.entity.AppUser;
import com.javalovers.core.appuser.service.AppUserService;
import com.javalovers.core.card.entity.Card;
import com.javalovers.core.card.repository.CardRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final BeneficiaryCreateMapper beneficiaryCreateMapper;
    private final BeneficiaryDTOMapper beneficiaryDTOMapper;
    private final BeneficiaryUpdateMapper beneficiaryUpdateMapper;
    private final CardRepository cardRepository;
    private final EntityManager entityManager;
    private final AppUserService appUserService;

    public Beneficiary generateBeneficiary(BeneficiaryFormDTO beneficiaryFormDTO) {
        return beneficiaryCreateMapper.convert(beneficiaryFormDTO);
    }

    public void save (Beneficiary beneficiary) {
        beneficiaryRepository.save(beneficiary);
    }

    public BeneficiaryDTO generateBeneficiaryDTO(Beneficiary beneficiary) {
        return beneficiaryDTOMapper.convert(beneficiary);
    }

    public Beneficiary getOrNull(Long id){
        return beneficiaryRepository.findById(id).orElse(null);
    }

    public void updateBeneficiary(Beneficiary beneficiary, BeneficiaryFormDTO beneficiaryFormDTO) {
        beneficiaryUpdateMapper.update(beneficiary, beneficiaryFormDTO);
    }

    @Transactional
    public void delete(Beneficiary beneficiary) {
        Long beneficiaryId = beneficiary.getBeneficiaryId();
        
        // Primeiro, buscar os IDs dos withdrawals associados ao beneficiário
        Query selectWithdrawalIdsQuery = entityManager.createNativeQuery(
            "SELECT withdrawal_id FROM withdrawal WHERE beneficiary_id = ?"
        );
        selectWithdrawalIdsQuery.setParameter(1, beneficiaryId);
        @SuppressWarnings("unchecked")
        List<Object> withdrawalIds = selectWithdrawalIdsQuery.getResultList();
        
        // Deletar os registros em item_withdrawn que referenciam esses withdrawals
        if (!withdrawalIds.isEmpty()) {
            for (Object withdrawalIdObj : withdrawalIds) {
                Long withdrawalId = ((Number) withdrawalIdObj).longValue();
                Query deleteItemWithdrawnQuery = entityManager.createNativeQuery(
                    "DELETE FROM item_withdrawn WHERE withdrawal_id = ?"
                );
                deleteItemWithdrawnQuery.setParameter(1, withdrawalId);
                deleteItemWithdrawnQuery.executeUpdate();
            }
        }
        
        // Deletar os withdrawals associados ao beneficiário
        Query deleteWithdrawalQuery = entityManager.createNativeQuery(
            "DELETE FROM withdrawal WHERE beneficiary_id = ?"
        );
        deleteWithdrawalQuery.setParameter(1, beneficiaryId);
        deleteWithdrawalQuery.executeUpdate();
        
        // Deletar o card associado ao beneficiário (se existir) antes de deletar o beneficiário
        Optional<Card> cardOptional = cardRepository.findByBeneficiaryId(beneficiaryId);
        
        if (cardOptional.isPresent()) {
            cardRepository.delete(cardOptional.get());
        }
        
        beneficiaryRepository.delete(beneficiary);
    }

    public List<Beneficiary> list(BeneficiaryFilterDTO beneficiaryFilterDTO) {
        Specification<Beneficiary> beneficiarySpecification = generateSpecification(beneficiaryFilterDTO);
        return beneficiaryRepository.findAll(beneficiarySpecification);
    }

    public Page<Beneficiary> list(Pageable pageable, BeneficiaryFilterDTO beneficiaryFilterDTO) {
        Specification<Beneficiary> beneficiarySpecification = generateSpecification(beneficiaryFilterDTO);
        return beneficiaryRepository.findAll(beneficiarySpecification, pageable);
    }

    private Specification<Beneficiary> generateSpecification(BeneficiaryFilterDTO beneficiaryFilterDTO) {
        SearchCriteria<String> fullNameCriteria = SpecificationHelper.generateInnerLikeCriteria("fullName", beneficiaryFilterDTO.fullName());
        SearchCriteria<String> cpfCriteria = SpecificationHelper.generateInnerLikeCriteria("cpf", beneficiaryFilterDTO.cpf());
        SearchCriteria<String> phoneCriteria = SpecificationHelper.generateInnerLikeCriteria("phone", beneficiaryFilterDTO.phone());
        SearchCriteria<String> socioeconomicDataCriteria = SpecificationHelper.generateInnerLikeCriteria("socioeconomicData", beneficiaryFilterDTO.socioeconomicData());

        Specification<Beneficiary> fullNameSpecification = new BeneficiarySpecification(fullNameCriteria);
        Specification<Beneficiary> cpfSpecification = new BeneficiarySpecification(cpfCriteria);
        Specification<Beneficiary> phoneSpecification = new BeneficiarySpecification(phoneCriteria);
        Specification<Beneficiary> socioeconomicDataSpecification = new BeneficiarySpecification(socioeconomicDataCriteria);

        return Specification.where(fullNameSpecification)
                .and(cpfSpecification)
                .and(phoneSpecification)
                .and(socioeconomicDataSpecification);
    }

    public Page<BeneficiaryDTO> generateBeneficiaryDTOPage(Page<Beneficiary> beneficiaryPage) {
        return beneficiaryPage.map(this::generateBeneficiaryDTO);
    }

    public List<BeneficiaryDTO> generateBeneficiaryDTOList(List<Beneficiary> beneficiaryList) {
        return beneficiaryList.stream().map(beneficiaryDTOMapper::convert).toList();
    }

    public Beneficiary getOrThrowException(Long id) {
        return beneficiaryRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("beneficiary", id)
        );
    }

    @Transactional
    public void approveBeneficiary(Long beneficiaryId, Long approverUserId) {
        Beneficiary beneficiary = getOrThrowException(beneficiaryId);
        AppUser approver = appUserService.getOrThrowException(approverUserId);
        
        beneficiary.setBeneficiaryStatus(BeneficiaryStatus.APPROVED);
        beneficiary.setApproverId(approver);
        
        beneficiaryRepository.save(beneficiary);
    }

    @Transactional
    public void rejectBeneficiary(Long beneficiaryId, Long approverUserId) {
        Beneficiary beneficiary = getOrThrowException(beneficiaryId);
        AppUser approver = appUserService.getOrThrowException(approverUserId);
        
        beneficiary.setBeneficiaryStatus(BeneficiaryStatus.REJECTED);
        beneficiary.setApproverId(approver);
        
        beneficiaryRepository.save(beneficiary);
    }
}
