package com.javalovers.core.donation.mapper;

import com.javalovers.core.donation.domain.dto.request.DonationFormDTO;
import com.javalovers.core.donation.domain.entity.Donation;
import com.javalovers.core.donor.domain.entity.Donor;
import com.javalovers.core.donor.repository.DonorRepository;
import com.javalovers.core.user.domain.entity.User;
import com.javalovers.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DonationCreateMapper {

    //itemDonorRepository
    private final DonorRepository donorRepository;
    private final UserRepository userRepository;

    public Donation convert(DonationFormDTO donationFormDTO, Donor donor, User user) {

        Donation donation = new Donation();
        donation.setDonationDate(donationFormDTO.donationDate());
        donation.setDonor(donor);
        donation.setReceiverUser(user);

        return donation;
    }
}
