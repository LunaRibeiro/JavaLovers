package com.javalovers.core.beneficiary.dto.entity;

import com.javalovers.core.beneficiarystatus.BeneficiaryStatus;
import com.javalovers.core.user.domain.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Beneficiary {

    private Long beneficiaryId;

    @NotBlank
    private String fullName;

    @NotBlank
    private String cpf;
    private String phone;
    private String socioeconomicData;
    private Date registrationDate;
    private BeneficiaryStatus beneficiaryStatus;

    private User approverId;
}
