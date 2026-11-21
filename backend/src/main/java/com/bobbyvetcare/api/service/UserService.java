package com.bobbyvetcare.api.service;

import com.bobbyvetcare.api.dto.request.UserCreateRequest;
import com.bobbyvetcare.api.dto.request.UserUpdateRequest;
import com.bobbyvetcare.api.dto.response.PageResponse;
import com.bobbyvetcare.api.dto.response.UserResponse;
import com.bobbyvetcare.api.entity.RoleEntity;
import com.bobbyvetcare.api.entity.UserEntity;
import com.bobbyvetcare.api.exception.BusinessConflictException;
import com.bobbyvetcare.api.exception.ResourceNotFoundException;
import com.bobbyvetcare.api.repository.RoleRepository;
import com.bobbyvetcare.api.repository.UserRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public PageResponse<UserResponse> getUsers(String q, String role, int page, int size) {
        String normalizedQ = (q != null && !q.isBlank()) ? q.trim() : null;
        String normalizedRole = (role != null && !role.isBlank()) ? role.trim() : null;
        Page<UserEntity> result = userRepository.searchUsers(normalizedQ, normalizedRole, PageRequest.of(page, size));
        return new PageResponse<>(
            result.getContent().stream().map(this::toResponse).toList(),
            result.getNumber(),
            result.getSize(),
            result.getTotalElements(),
            result.getTotalPages()
        );
    }

    public List<UserResponse> getVeterinarians() {
        return userRepository.findByRole_NameIgnoreCaseAndActiveTrueOrderByFullNameAsc("VETERINARIO")
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public UserResponse getUserById(String id) {
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
        return toResponse(user);
    }

    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email().trim())) {
            throw new BusinessConflictException("Ya existe un usuario registrado con el correo: " + request.email());
        }
        RoleEntity role = roleRepository.findByNameIgnoreCase(request.roleName().trim())
            .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado: " + request.roleName()));

        UserEntity user = new UserEntity();
        user.setRole(role);
        user.setFullName(request.fullName().trim());
        user.setEmail(request.email().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setPhone(request.phone() != null ? request.phone().trim() : null);
        user.setActive(true);

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUser(String id, UserUpdateRequest request) {
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
        RoleEntity role = roleRepository.findByNameIgnoreCase(request.roleName().trim())
            .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado: " + request.roleName()));

        user.setFullName(request.fullName().trim());
        user.setPhone(request.phone() != null ? request.phone().trim() : null);
        user.setRole(role);
        if (request.active() != null) {
            user.setActive(request.active());
        }

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void deactivateUser(String id) {
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
        user.setActive(false);
        userRepository.save(user);
    }

    public UserResponse toResponse(UserEntity user) {
        return new UserResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getPhone(),
            user.getRole().getName(),
            user.getAvatarUrl(),
            Boolean.TRUE.equals(user.getActive())
        );
    }
}
