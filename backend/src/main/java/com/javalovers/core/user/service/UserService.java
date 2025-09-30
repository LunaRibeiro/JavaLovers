package com.javalovers.core.user.service;

import com.javalovers.core.profile.domain.dto.request.ProfileFormDTO;
import com.javalovers.core.profile.domain.dto.response.ProfileDTO;
import com.javalovers.core.profile.domain.entity.Profile;
import com.javalovers.core.profile.mapper.ProfileCreateMapper;
import com.javalovers.core.profile.mapper.ProfileDTOMapper;
import com.javalovers.core.profile.mapper.ProfileUpdateMapper;
import com.javalovers.core.profile.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final ProfileRepository profileRepository;
    private final ProfileCreateMapper profileCreateMapper;
    private final ProfileDTOMapper profileDTOMapper;
    private final ProfileUpdateMapper profileUpdateMapper;

    public Profile generateProfile(ProfileFormDTO profileFormDTO) {
        return profileCreateMapper.convert(profileFormDTO);
    }

    public void save (Profile profile) {
        profileRepository.save(profile);
    }

    public ProfileDTO generateProfileDTO(Profile profile) {
        return profileDTOMapper.convert(profile);
    }

    public Profile getOrNull(Long id){
        return profileRepository.findById(id).orElse(null);
    }

    public void updateProfile(Profile profile, ProfileFormDTO profileFormDTO) {
        profileUpdateMapper.update(profile, profileFormDTO);
    }

    public void delete(Profile profile) {
        profileRepository.delete(profile);
    }

    public List<Profile> list() {
        return profileRepository.findAll();
    }

    public Page<Profile> list(Pageable pageable) {
        return profileRepository.findAll(pageable);
    }

    public Page<ProfileDTO> generateProfileDTOPage(Page<Profile> profilePage) {
        return profilePage.map(this::generateProfileDTO);
    }

    public List<ProfileDTO> generateProfileDTOList(List<Profile> profileList) {
        return profileList.stream().map(profileDTOMapper::convert).toList();
    }
}

