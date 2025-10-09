package com.javalovers.core.beneficiary.domain.entity;

import com.javalovers.core.beneficiarystatus.BeneficiaryStatus;
import com.javalovers.core.user.domain.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Beneficiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long beneficiaryId;

    @NotBlank
    private String fullName;

    @NotBlank
    @Column(unique = true)
    private String cpf;
    private String phone;
    private String socioeconomicData;
    private Date registrationDate;
    private BeneficiaryStatus beneficiaryStatus;

    @ManyToOne
    @JoinColumn(name = "approver_user_id", nullable = false)
    private User approverId;

}
