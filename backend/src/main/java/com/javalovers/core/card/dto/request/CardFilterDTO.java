package com.javalovers.core.card.dto.request;

import java.util.Date;

public record CardFilterDTO(
        String uniqueNumber,
        Date issueDate,
        Long beneficiaryId
) {
}
