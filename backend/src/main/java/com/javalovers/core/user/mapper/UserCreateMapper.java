package com.javalovers.core.user.mapper;

import com.javalovers.core.user.domain.dto.request.UserFormDTO;
import com.javalovers.core.user.domain.entity.User;
import org.springframework.stereotype.Service;

@Service
public class UserCreateMapper {

    public User convert(UserFormDTO userFormDTO) {
        User user = new User();
        user.setName(userFormDTO.name());
        user.setEmail(userFormDTO.email());
        user.setLogin(userFormDTO.login());
        user.setPasswordHash(userFormDTO.passwordHash());
        user.setStatus(userFormDTO.status());
        user.setProfile(userFormDTO.profile());

        return user;
    }
}
