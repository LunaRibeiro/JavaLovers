package com.javalovers.core.user.mapper;

import com.javalovers.core.user.domain.dto.request.UserFormDTO;
import com.javalovers.core.user.domain.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserUpdateMapper {

    private final PasswordEncoder passwordEncoder;

    public void update(User user, UserFormDTO userFormDTO) {
        user.setName(userFormDTO.name());
        user.setLogin(userFormDTO.login());
        user.setEmail(userFormDTO.email());
        // Só atualiza a senha se uma nova senha foi fornecida
        if (userFormDTO.password() != null && !userFormDTO.password().trim().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(userFormDTO.password()));
        }
        user.setStatus(userFormDTO.status());
        user.setProfile(userFormDTO.profile());
    }
}
