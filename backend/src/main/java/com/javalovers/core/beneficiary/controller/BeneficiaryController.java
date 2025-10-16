package com.javalovers.core.beneficiary.controller;

import com.javalovers.common.utils.HttpUtils;
import com.javalovers.core.beneficiary.domain.dto.request.BeneficiaryFilterDTO;
import com.javalovers.core.beneficiary.domain.dto.request.BeneficiaryFormDTO;
import com.javalovers.core.beneficiary.domain.dto.response.BeneficiaryDTO;
import com.javalovers.core.beneficiary.domain.entity.Beneficiary;
import com.javalovers.core.beneficiary.service.BeneficiaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/beneficiary")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    @GetMapping
    public ResponseEntity<Page<BeneficiaryDTO>> listPaged(Pageable pageable, BeneficiaryFilterDTO beneficiaryFilterDTO) {
        Page<Beneficiary> beneficiaryPage = beneficiaryService.list(pageable, beneficiaryFilterDTO);
        Page<BeneficiaryDTO> beneficiaryDTOPage = beneficiaryService.generateBeneficiaryDTOPage(beneficiaryPage);

        return ResponseEntity.ok(beneficiaryDTOPage);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BeneficiaryDTO>> list(BeneficiaryFilterDTO beneficiaryFilterDTO) {
        List<Beneficiary> beneficiaryList = beneficiaryService.list(beneficiaryFilterDTO);
        List<BeneficiaryDTO> beneficiaryDTOList = beneficiaryService.generateBeneficiaryDTOList(beneficiaryList);

        return ResponseEntity.ok(beneficiaryDTOList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BeneficiaryDTO> get(@PathVariable Long id) {
        Beneficiary beneficiary = beneficiaryService.getOrNull(id);
        if(beneficiary == null) return ResponseEntity.notFound().build();

        BeneficiaryDTO beneficiaryDTO = beneficiaryService.generateBeneficiaryDTO(beneficiary);

        return ResponseEntity.ok(beneficiaryDTO);
    }

    @PostMapping
    public ResponseEntity<BeneficiaryDTO> create(@RequestBody @Valid BeneficiaryFormDTO beneficiaryFormDTO, UriComponentsBuilder uriComponentsBuilder) {
        Beneficiary beneficiary = beneficiaryService.generateBeneficiary(beneficiaryFormDTO);
        beneficiaryService.save(beneficiary);

        URI uri = HttpUtils.createURI(uriComponentsBuilder, "beneficiary", beneficiary.getBeneficiaryId());

        return ResponseEntity.created(uri).body(beneficiaryService.generateBeneficiaryDTO(beneficiary));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody @Valid BeneficiaryFormDTO beneficiaryFormDTO) {
        Beneficiary beneficiary = beneficiaryService.getOrNull(id);
        if(beneficiary == null) return ResponseEntity.notFound().build();

        beneficiaryService.updateBeneficiary(beneficiary, beneficiaryFormDTO);

        beneficiaryService.save(beneficiary);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Beneficiary beneficiary = beneficiaryService.getOrNull(id);
        if(beneficiary == null) return ResponseEntity.notFound().build();

        beneficiaryService.delete(beneficiary);

        return ResponseEntity.noContent().build();
    }
}
