package com.javalovers.core.user.mapper;

import com.javalovers.core.user.domain.dto.response.UserDTO;
import com.javalovers.core.user.domain.entity.User;
import org.springframework.stereotype.Service;

@Service
public class UserDTOMapper {

    public UserDTO convert(User user) {
        if(user == null) return null;
        return new UserDTO(
                user.getUserId(),
                user.getName(),
                user.getLogin(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getStatus(),
                user.getProfile()
        );
    }
}
