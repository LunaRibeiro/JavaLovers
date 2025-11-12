package com.javalovers.core.appuser.domain.dto.response;

import com.javalovers.core.profile.domain.entity.Profile;
import com.javalovers.core.status.Status;

public record AppUserDTO(
                Long userId,
                String name,
                String login,
                String email,
                Status status,
                Profile profile) {
}
