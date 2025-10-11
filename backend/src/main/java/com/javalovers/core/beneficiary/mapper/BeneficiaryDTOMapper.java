package com.javalovers.core.beneficiary.mapper;

import com.javalovers.core.beneficiary.domain.dto.response.BeneficiaryDTO;
import com.javalovers.core.beneficiary.domain.entity.Beneficiary;
import com.javalovers.core.user.mapper.UserDTOMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class BeneficiaryDTOMapper {

    private final UserDTOMapper userDTOMapper;

    public BeneficiaryDTO convert(Beneficiary beneficiary){
        if(beneficiary == null) return null;
        return new BeneficiaryDTO(
                beneficiary.getBeneficiaryId(),
                beneficiary.getFullName(),
                beneficiary.getCpf(),
                beneficiary.getPhone(),
                beneficiary.getSocioeconomicData(),
                beneficiary.getRegistrationDate(),
                beneficiary.getBeneficiaryStatus(),
                userDTOMapper.convert(beneficiary.getApproverId())
        );
    }
}
