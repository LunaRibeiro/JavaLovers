package com.javalovers.core.donor.mapper;

import com.javalovers.core.category.domain.entity.Category;
import com.javalovers.core.donor.domain.dto.request.DonorFormDTO;
import com.javalovers.core.donor.domain.entity.Donor;
import com.javalovers.core.item.domain.dto.request.ItemFormDTO;
import com.javalovers.core.item.domain.entity.Item;
import org.springframework.stereotype.Service;

@Service
public class DonorCreateMapper {

    public Donor convert(DonorFormDTO donorFormDTO){
        Donor donor = new Donor();
        donor.setName(donorFormDTO.name());
        donor.setCpfCnpj(donorFormDTO.cpfCnpj());
        donor.setContact(donorFormDTO.contact());

        return donor;
    }
}
