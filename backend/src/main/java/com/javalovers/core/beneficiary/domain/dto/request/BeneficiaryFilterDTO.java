package com.javalovers.core.beneficiary.domain.dto.request;

import com.javalovers.core.beneficiarystatus.BeneficiaryStatus;

import java.util.Date;

public record BeneficiaryFilterDTO (
        String fullName,
        String cpf,
        String phone,
        String socioeconomicData,
        Date registrationDate,
        BeneficiaryStatus beneficiaryStatus
){
}
