package com.javalovers.core.user.mapper;

import com.javalovers.core.user.domain.dto.request.UserFormDTO;
import com.javalovers.core.user.domain.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCreateMapper {

    private final PasswordEncoder passwordEncoder;

    public User convert(UserFormDTO userFormDTO) {
        User user = new User();
        user.setName(userFormDTO.name());
        user.setEmail(userFormDTO.email());
        user.setLogin(userFormDTO.login());
        user.setPasswordHash(passwordEncoder.encode(userFormDTO.password()));
        user.setStatus(userFormDTO.status());
        user.setProfile(userFormDTO.profile());

        return user;
    }
}
