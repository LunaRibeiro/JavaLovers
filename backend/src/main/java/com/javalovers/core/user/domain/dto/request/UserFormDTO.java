package com.javalovers.core.user.domain.dto.request;

import com.javalovers.core.profile.domain.entity.Profile;
import com.javalovers.core.status.Status;

public record UserFormDTO(
                String name,
                String login,
                String email,
                String password,
                Status status,
                Profile profile) {
}
