package com.bobbyvetcare.api.security;

import com.bobbyvetcare.api.entity.UserEntity;
import com.bobbyvetcare.api.repository.UserRepository;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        boolean enabled = Boolean.TRUE.equals(user.getActive());
        String roleAuthority = "ROLE_" + user.getRole().getName().toUpperCase();

        return User.builder()
            .username(user.getEmail())
            .password(user.getPasswordHash())
            .disabled(!enabled)
            .authorities(List.of(new SimpleGrantedAuthority(roleAuthority)))
            .build();
    }
}
