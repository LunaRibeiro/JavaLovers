package com.javalovers.core.beneficiary.service;

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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final BeneficiaryCreateMapper beneficiaryCreateMapper;
    private final BeneficiaryDTOMapper beneficiaryDTOMapper;
    private final BeneficiaryUpdateMapper beneficiaryUpdateMapper;

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

    public void delete(Beneficiary beneficiary) {
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
        SearchCriteria<Date> registrationDateCriteria = SpecificationHelper.generateLessThanCriteria("registrationDate", beneficiaryFilterDTO.registrationDate());

        Specification<Beneficiary> fullNameSpecification = new BeneficiarySpecification(fullNameCriteria);
        Specification<Beneficiary> cpfSpecification = new BeneficiarySpecification(cpfCriteria);
        Specification<Beneficiary> phoneSpecification = new BeneficiarySpecification(phoneCriteria);
        Specification<Beneficiary> socioeconomicDataSpecification = new BeneficiarySpecification(socioeconomicDataCriteria);
        Specification<Beneficiary> registrationDateSpecification = new BeneficiarySpecification(registrationDateCriteria);

        return Specification.where(fullNameSpecification)
                .and(cpfSpecification)
                .and(phoneSpecification)
                .and(socioeconomicDataSpecification)
                .and(registrationDateSpecification);
    }

    public Page<BeneficiaryDTO> generateBeneficiaryDTOPage(Page<Beneficiary> beneficiaryPage) {
        return beneficiaryPage.map(this::generateBeneficiaryDTO);
    }

    public List<BeneficiaryDTO> generateBeneficiaryDTOList(List<Beneficiary> beneficiaryList) {
        return beneficiaryList.stream().map(beneficiaryDTOMapper::convert).toList();
    }
}
