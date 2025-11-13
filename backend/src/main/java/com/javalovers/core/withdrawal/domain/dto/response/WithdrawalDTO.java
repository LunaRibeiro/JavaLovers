package com.javalovers.core.withdrawal.domain.dto.response;

import com.javalovers.core.appuser.domain.dto.response.AppUserDTO;
import com.javalovers.core.beneficiary.domain.dto.response.BeneficiaryDTO;

import java.util.Date;

public record WithdrawalDTO(
        Long withdrawalId,
        Date withdrawalDate,
        BeneficiaryDTO beneficiary,
        AppUserDTO appUser
) {
}
