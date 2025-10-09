package com.javalovers.core.beneficiary.domain.dto.request;

import com.javalovers.core.beneficiarystatus.BeneficiaryStatus;

import java.util.Date;

public record BeneficiaryFormDTO(
        String fullName,
        String phone,
        String socioeconomicData,
        Date registrationDate,
        BeneficiaryStatus beneficiaryStatus
) {
}
