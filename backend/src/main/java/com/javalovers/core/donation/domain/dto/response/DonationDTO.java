package com.javalovers.core.donation.domain.dto.response;

import com.javalovers.core.donor.domain.dto.response.DonorDTO;
import com.javalovers.core.user.domain.dto.response.UserDTO;

import java.util.Date;

public record DonationDTO(
        Long donationId,
        Date donationDate,
        UserDTO receiverUser,
        DonorDTO donor
) {
}
