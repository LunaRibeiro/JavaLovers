package com.javalovers.core.card.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "card")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "card_id")
    private Long cardId;

    @NotNull
    @Column(name = "unique_number", unique = true, nullable = false)
    private String uniqueNumber;

    @NotNull
    @Column(name = "issue_date")
    private Date issueDate;

    @NotNull
    @Column(name = "beneficiary_id", unique = true)
    private Long beneficiaryId;

}
