package com.javalovers.core.donor.domain.dto.request;

public record DonorFormDTO(
        String name,
        String cpfCnpj,
        String contact
) {
}
