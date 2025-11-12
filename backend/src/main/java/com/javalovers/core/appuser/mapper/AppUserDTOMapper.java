package com.javalovers.core.appuser.mapper;

import com.javalovers.core.appuser.domain.dto.response.AppUserDTO;
import com.javalovers.core.appuser.domain.entity.AppUser;
import org.springframework.stereotype.Service;

@Service
public class AppUserDTOMapper {

    public AppUserDTO convert(AppUser user) {
        if (user == null)
            return null;
        return new AppUserDTO(
                user.getUserId(),
                user.getName(),
                user.getLogin(),
                user.getEmail(),
                user.getStatus(),
                user.getProfile());
    }
}
