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
@Table(name = "beneficiary")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Beneficiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "beneficiary_id")
    private Long beneficiaryId;

    @NotBlank
    @Column(name = "full_name")
    private String fullName;

    @NotBlank
    @Column(name = "cpf", unique = true)
    private String cpf;

    @Column(name = "address")
    private String address;

    @Column(name = "phone")
    private String phone;

    @Column(name = "socioeconomic_data")
    private String socioeconomicData;

    @Column(name = "registration_date")
    private Date registrationDate;

    @Column(name = "beneficiary_status")
    private BeneficiaryStatus beneficiaryStatus;

    @ManyToOne
    @JoinColumn(name = "approver_user_id")
    private User approverId;

}
