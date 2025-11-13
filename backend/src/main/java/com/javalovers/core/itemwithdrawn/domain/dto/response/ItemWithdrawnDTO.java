package com.javalovers.core.itemwithdrawn.domain.dto.response;

import com.javalovers.core.item.domain.dto.response.ItemDTO;
import com.javalovers.core.withdrawal.domain.dto.response.WithdrawalDTO;

public record ItemWithdrawnDTO(
         Long itemWithdrawnId,
         WithdrawalDTO withdrawalDTO,
         ItemDTO itemDTO,
         Integer quantity
) {
}
