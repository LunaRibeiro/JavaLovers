package com.javalovers.core.user.controller;

import com.javalovers.common.utils.HttpUtils;
import com.javalovers.core.user.domain.dto.request.UserFormDTO;
import com.javalovers.core.user.domain.dto.response.UserDTO;
import com.javalovers.core.user.domain.entity.User;
import com.javalovers.core.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserDTO>> listPaged(Pageable pageable) {
        Page<User> userPage = userService.list(pageable);
        Page<UserDTO> userDTOPage = userService.generateUserDTOPage(userPage);

        return ResponseEntity.ok(userDTOPage);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> list() {
        List<User> userList = userService.list();
        List<UserDTO> userDTOList = userService.generateUserDTOList(userList);

        return ResponseEntity.ok(userDTOList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> get(@PathVariable Long id) {
        User user = userService.getOrNull(id);
        if(user == null) return ResponseEntity.notFound().build();

        UserDTO userDTO = userService.generateUserDTO(user);

        return ResponseEntity.ok(userDTO);
    }

    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody @Valid UserFormDTO userFormDTO, UriComponentsBuilder uriComponentsBuilder) {
        User user = userService.generateUser(userFormDTO);
        userService.save(user);

        URI uri = HttpUtils.createURI(uriComponentsBuilder, "profile", user.getUserId());

        return ResponseEntity.created(uri).body(userService.generateUserDTO(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody @Valid UserFormDTO userFormDTO) {
        User user = userService.getOrNull(id);
        if(user == null) return ResponseEntity.notFound().build();

        userService.updateUser(user, userFormDTO);

        userService.save(user);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        User user = userService.getOrNull(id);
        if(user == null) return ResponseEntity.notFound().build();

        userService.delete(user);

        return ResponseEntity.noContent().build();
    }
}
