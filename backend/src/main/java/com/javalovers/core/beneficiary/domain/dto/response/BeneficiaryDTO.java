package com.javalovers.core.beneficiary.domain.dto.response;

import com.javalovers.core.beneficiarystatus.BeneficiaryStatus;
import com.javalovers.core.user.domain.dto.response.UserDTO;

import java.util.Date;

public record BeneficiaryDTO (
        Long beneficiaryId,
        String fullName,
        String cpf,
        String phone,
        String socioeconomicData,
        Date registrationDate,
        BeneficiaryStatus beneficiaryStatus,
        UserDTO approverId
){
}
