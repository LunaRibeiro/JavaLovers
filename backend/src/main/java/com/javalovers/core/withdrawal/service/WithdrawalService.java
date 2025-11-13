package com.javalovers.core.withdrawal.service;

import com.javalovers.common.specification.SearchCriteria;
import com.javalovers.common.specification.SpecificationHelper;
import com.javalovers.core.appuser.domain.entity.AppUser;
import com.javalovers.core.beneficiary.domain.entity.Beneficiary;
import com.javalovers.core.withdrawal.domain.dto.request.WithdrawalFilterDTO;
import com.javalovers.core.withdrawal.domain.dto.request.WithdrawalFormDTO;
import com.javalovers.core.withdrawal.domain.dto.response.WithdrawalDTO;
import com.javalovers.core.withdrawal.domain.entity.Withdrawal;
import com.javalovers.core.withdrawal.mapper.WithdrawalCreateMapper;
import com.javalovers.core.withdrawal.mapper.WithdrawalDTOMapper;
import com.javalovers.core.withdrawal.mapper.WithdrawalUpdateMapper;
import com.javalovers.core.withdrawal.repository.WithdrawalRepository;
import com.javalovers.core.withdrawal.specification.WithdrawalSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WithdrawalService {

    private final WithdrawalRepository withdrawalRepository;
    private final WithdrawalCreateMapper withdrawalCreateMapper;
    private final WithdrawalDTOMapper withdrawalDTOMapper;
    private final WithdrawalUpdateMapper withdrawalUpdateMapper;

    public Withdrawal generateWithdrawal(WithdrawalFormDTO withdrawalFormDTO, Beneficiary beneficiary, AppUser attendantUser) {
        return withdrawalCreateMapper.convert(withdrawalFormDTO, beneficiary, attendantUser);
    }

    public void save (Withdrawal withdrawal) {
        withdrawalRepository.save(withdrawal);
    }

    public WithdrawalDTO generateWithdrawalDTO(Withdrawal withdrawal) {
        return withdrawalDTOMapper.convert(withdrawal);
    }

    public Withdrawal getOrNull(Long id){
        return withdrawalRepository.findById(id).orElse(null);
    }

    public void updateWithdrawal(Withdrawal withdrawal, WithdrawalFormDTO withdrawalFormDTO, Beneficiary beneficiary, AppUser attendantUser) {
        withdrawalUpdateMapper.update(withdrawal, withdrawalFormDTO, beneficiary, attendantUser);
    }

    public void delete(Withdrawal withdrawal) {
        withdrawalRepository.delete(withdrawal);
    }

    public List<Withdrawal> list(WithdrawalFilterDTO withdrawalFilterDTO) {
        Specification<Withdrawal> withdrawalSpecification = generateSpecification(withdrawalFilterDTO);
        return withdrawalRepository.findAll(withdrawalSpecification);
    }

    public Page<Withdrawal> list(Pageable pageable, WithdrawalFilterDTO withdrawalFilterDTO) {
        Specification<Withdrawal> withdrawalSpecification = generateSpecification(withdrawalFilterDTO);
        return withdrawalRepository.findAll(withdrawalSpecification, pageable);
    }

    private Specification<Withdrawal> generateSpecification(WithdrawalFilterDTO withdrawalFilterDTO) {
        SearchCriteria<Long> beneficiaryCriteria = SpecificationHelper.generateEqualsCriteria("beneficiary.id", withdrawalFilterDTO.beneficiaryId());
        SearchCriteria<Long> attendantUserCriteria = SpecificationHelper.generateEqualsCriteria("attendantUserId.id", withdrawalFilterDTO.attendantUserId());
        SearchCriteria<Date> withdrawalDateCriteria = SpecificationHelper.generateEqualsCriteria("withdrawalDate", withdrawalFilterDTO.withdrawalDate());

        Specification<Withdrawal> beneficiarySpecification = new WithdrawalSpecification(beneficiaryCriteria);
        Specification<Withdrawal> attendantSpecification = new WithdrawalSpecification(attendantUserCriteria);
        Specification<Withdrawal> withdrawalDateSpecification = new WithdrawalSpecification(withdrawalDateCriteria);

        return Specification.where(beneficiarySpecification)
                .and(attendantSpecification)
                .and(withdrawalDateSpecification);
    }

    public Page<WithdrawalDTO> generateWithdrawalDTOPage(Page<Withdrawal> withdrawalPage) {
        return withdrawalPage.map(this::generateWithdrawalDTO);
    }

    public List<WithdrawalDTO> generateWithdrawalDTOList(List<Withdrawal> withdrawalList) {
        return withdrawalList.stream().map(withdrawalDTOMapper::convert).toList();
    }

}
