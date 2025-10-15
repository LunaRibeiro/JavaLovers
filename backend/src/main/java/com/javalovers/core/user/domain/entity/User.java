package com.javalovers.core.user.domain.entity;

import com.javalovers.core.profile.domain.entity.Profile;
import com.javalovers.core.status.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "app_user")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @NotBlank
    @Column(name = "name")
    private String name;

    @NotBlank
    @Column(name = "login", nullable = false, unique = true)
    private String login;

    @NotBlank
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(name = "password_hash")
    private String passwordHash;

    @NotBlank
    @Convert(converter = Status.StatusConverter.class)
    @Column(name = "status")
    private Status status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;
}
