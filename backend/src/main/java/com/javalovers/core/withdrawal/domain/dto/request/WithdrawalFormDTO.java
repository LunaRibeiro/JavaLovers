package com.javalovers.core.withdrawal.domain.dto.request;

import java.util.Date;

public record WithdrawalFormDTO(
        Date withdrawalDate,
        Long beneficiaryId,
        Long attendantUserId
) {
}
