package com.javalovers.core.card.dto.response;

public record CardDTO(
        Long cardId,
        String uniqueNumber,
        Long beneficiaryId
) {
}
