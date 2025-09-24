package com.javalovers.core.user.domain.dto.response;

import com.javalovers.core.profile.domain.entity.Profile;
import com.javalovers.core.status.Status;

public record UserDTO(
        String name,
        String login,
        String email,
        String passwordHash,
        Status status,
        Profile profile
) {
}
