package com.javalovers.core.card.dto.response;

import java.util.Date;

public record CardDTO(
        Long id,
        String uniqueNumber,
        Date issueDate,
        Long beneficiaryId
) {
}
