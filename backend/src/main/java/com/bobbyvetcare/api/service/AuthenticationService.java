package com.bobbyvetcare.api.service;

import com.bobbyvetcare.api.dto.request.ChangePasswordRequest;
import com.bobbyvetcare.api.dto.request.LoginRequest;
import com.bobbyvetcare.api.dto.request.PasswordResetConfirmRequest;
import com.bobbyvetcare.api.dto.request.PasswordResetRequest;
import com.bobbyvetcare.api.dto.request.RegisterRequest;
import com.bobbyvetcare.api.dto.response.AuthResponse;
import com.bobbyvetcare.api.dto.response.UserResponse;
import com.bobbyvetcare.api.entity.PasswordResetTokenEntity;
import com.bobbyvetcare.api.entity.RoleEntity;
import com.bobbyvetcare.api.entity.TokenBlacklistEntity;
import com.bobbyvetcare.api.entity.UserEntity;
import com.bobbyvetcare.api.exception.BadRequestException;
import com.bobbyvetcare.api.exception.BusinessConflictException;
import com.bobbyvetcare.api.exception.ResourceNotFoundException;
import com.bobbyvetcare.api.repository.PasswordResetTokenRepository;
import com.bobbyvetcare.api.repository.RoleRepository;
import com.bobbyvetcare.api.repository.TokenBlacklistRepository;
import com.bobbyvetcare.api.repository.UserRepository;
import com.bobbyvetcare.api.security.CustomUserDetailsService;
import com.bobbyvetcare.api.security.JwtService;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthenticationService {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final TokenBlacklistRepository tokenBlacklistRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthenticationService(
        AuthenticationManager authenticationManager,
        UserRepository userRepository,
        RoleRepository roleRepository,
        PasswordResetTokenRepository passwordResetTokenRepository,
        TokenBlacklistRepository tokenBlacklistRepository,
        PasswordEncoder passwordEncoder,
        CustomUserDetailsService userDetailsService,
        JwtService jwtService,
        UserService userService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.tokenBlacklistRepository = tokenBlacklistRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, request.password())
        );

        UserEntity user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + email));

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String token = jwtService.generateToken(
            userDetails,
            Map.of("role", user.getRole().getName(), "userId", user.getId())
        );

        UserResponse userResponse = userService.toResponse(user);
        return new AuthResponse(token, "Bearer", userResponse);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new BusinessConflictException("Ya existe una cuenta registrada con el correo: " + email);
        }

        RoleEntity clientRole = roleRepository.findByNameIgnoreCase("CLIENTE")
            .orElseThrow(() -> new ResourceNotFoundException("Rol CLIENTE no encontrado"));

        UserEntity user = new UserEntity();
        user.setRole(clientRole);
        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setPhone(request.phone() != null ? request.phone().trim() : null);
        user.setActive(true);

        UserEntity saved = userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String token = jwtService.generateToken(
            userDetails,
            Map.of("role", saved.getRole().getName(), "userId", saved.getId())
        );

        return new AuthResponse(token, "Bearer", userService.toResponse(saved));
    }

    @Transactional
    public void logout(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        String token = authHeader.substring("Bearer ".length()).trim();
        if (token.isEmpty()) {
            return;
        }
        try {
            String jti = jwtService.extractJti(token);
            Date expiration = jwtService.extractExpiration(token);
            if (jti != null && !tokenBlacklistRepository.existsByTokenJti(jti)) {
                TokenBlacklistEntity entry = new TokenBlacklistEntity();
                entry.setTokenJti(jti);
                entry.setExpiresAt(
                    expiration != null
                        ? LocalDateTime.ofInstant(expiration.toInstant(), ZoneId.systemDefault())
                        : LocalDateTime.now().plusDays(1)
                );
                tokenBlacklistRepository.save(entry);
            }
        } catch (Exception ignored) {
            // Token ya expirado o inválido
        }
    }

    @Transactional
    public void requestPasswordReset(PasswordResetRequest request) {
        String email = request.email().trim().toLowerCase();
        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            String code = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
            PasswordResetTokenEntity resetToken = new PasswordResetTokenEntity();
            resetToken.setUsuario(user);
            resetToken.setToken(code);
            resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(30));
            resetToken.setUsed(false);
            passwordResetTokenRepository.save(resetToken);
            log.info("[PASSWORD_RESET_TOKEN] Generado código de recuperación para email={}: {}", email, code);
        });
    }

    @Transactional
    public void confirmPasswordReset(PasswordResetConfirmRequest request) {
        String tokenCode = request.token().trim();
        PasswordResetTokenEntity resetToken = passwordResetTokenRepository.findByToken(tokenCode)
            .orElseThrow(() -> new BadRequestException("Código de recuperación inválido"));

        if (Boolean.TRUE.equals(resetToken.getUsed()) || resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("El código de recuperación ya fue utilizado o ha expirado");
        }

        UserEntity user = resetToken.getUsuario();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        resetToken.setUsed(true);
        userRepository.save(user);
        passwordResetTokenRepository.save(resetToken);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        UserEntity user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + email));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("La contraseña actual es incorrecta");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
