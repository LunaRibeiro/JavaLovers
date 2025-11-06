package com.javalovers.core.donation.mapper;

import com.javalovers.core.donation.domain.dto.response.DonationDTO;
import com.javalovers.core.donation.domain.entity.Donation;
import com.javalovers.core.donor.mapper.DonorDTOMapper;
import com.javalovers.core.user.mapper.UserDTOMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DonationDTOMapper {

    private final DonorDTOMapper donorDTOMapper;
    private final UserDTOMapper userDTOMapper;
    //itemDonatedMapper

    public DonationDTO convert(Donation donation) {
        if(donation == null) return null;

        return new DonationDTO(
                donation.getDonationId(),
                donation.getDonationDate(),
                userDTOMapper.convert(donation.getReceiverUser()),
                donorDTOMapper.convert(donation.getDonor())
        );
    }

}
