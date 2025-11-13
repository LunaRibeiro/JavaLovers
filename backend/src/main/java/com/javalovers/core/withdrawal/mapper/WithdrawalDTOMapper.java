package com.javalovers.core.withdrawal.mapper;

import com.javalovers.core.appuser.mapper.AppUserDTOMapper;
import com.javalovers.core.beneficiary.mapper.BeneficiaryDTOMapper;
import com.javalovers.core.withdrawal.domain.dto.response.WithdrawalDTO;
import com.javalovers.core.withdrawal.domain.entity.Withdrawal;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class WithdrawalDTOMapper {

    private final BeneficiaryDTOMapper beneficiaryDTOMapper;
    private final AppUserDTOMapper appUserDTOMapper;

    public WithdrawalDTO convert(Withdrawal withdrawal) {
        if (withdrawal == null) return null;
        return new WithdrawalDTO(
                withdrawal.getWithdrawalId(),
                withdrawal.getWithdrawalDate(),
                beneficiaryDTOMapper.convert(withdrawal.getBeneficiary()),
                appUserDTOMapper.convert(withdrawal.getAttendantUser())
        );
    }

}
