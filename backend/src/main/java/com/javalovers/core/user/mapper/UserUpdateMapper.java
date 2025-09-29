package com.javalovers.core.user.mapper;

import com.javalovers.core.user.domain.dto.request.UserFormDTO;
import com.javalovers.core.user.domain.entity.User;
import org.springframework.stereotype.Service;

@Service
public class UserUpdateMapper {

    public void update(User user, UserFormDTO userFormDTO) {
        user.setName(userFormDTO.name());
        user.setLogin(userFormDTO.login());
        user.setEmail(userFormDTO.email());
        user.setPasswordHash(userFormDTO.passwordHash());
        user.setStatus(userFormDTO.status());
        user.setProfile(userFormDTO.profile());
    }
}
