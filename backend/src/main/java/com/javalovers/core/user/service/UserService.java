package com.javalovers.core.user.service;

import com.javalovers.common.exception.EntityNotFoundException;
import com.javalovers.core.user.domain.dto.request.UserFormDTO;
import com.javalovers.core.user.domain.dto.response.UserDTO;
import com.javalovers.core.user.domain.entity.User;
import com.javalovers.core.user.mapper.UserCreateMapper;
import com.javalovers.core.user.mapper.UserDTOMapper;
import com.javalovers.core.user.mapper.UserUpdateMapper;
import com.javalovers.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserCreateMapper userCreateMapper;
    private final UserDTOMapper userDTOMapper;
    private final UserUpdateMapper userUpdateMapper;

    public User generateUser(UserFormDTO userFormDTO) {
        return userCreateMapper.convert(userFormDTO);
    }

    public void save (User user) {
        userRepository.save(user);
    }

    public UserDTO generateUserDTO(User user) {
        return userDTOMapper.convert(user);
    }

    public User getOrNull(Long id){
        return userRepository.findById(id).orElse(null);
    }

    public void updateUser(User user, UserFormDTO userFormDTO) {
        userUpdateMapper.update(user, userFormDTO);
    }

    public void delete(User user) {
        userRepository.delete(user);
    }

    public List<User> list() {
        return userRepository.findAll();
    }

    public Page<User> list(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Page<UserDTO> generateUserDTOPage(Page<User> userPage) {
        return userPage.map(this::generateUserDTO);
    }

    public List<UserDTO> generateUserDTOList(List<User> userList) {
        return userList.stream().map(userDTOMapper::convert).toList();
    }

    public User getOrThrowException(Long id) {
        return userRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("User", id)
        );
    }

}