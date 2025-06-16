package com.letz.service;

import com.letz.dto.auth.AuthResponse;
import com.letz.dto.auth.LoginRequest;
import com.letz.dto.auth.RegisterRequest;
import com.letz.dto.user.UserResponse;
import com.letz.entity.User;
import com.letz.repository.UserRepository;
import com.letz.security.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Serviço de autenticação
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    public AuthResponse login(LoginRequest request) {
        try {
            // Buscar usuário por email
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            // Verificar senha
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Credenciais inválidas");
            }

            // Criar UserDetails para o JWT
            UserBuilder userBuilder = org.springframework.security.core.userdetails.User.withUsername(user.getEmail());
            UserDetails userDetails = userBuilder
                    .password(user.getPassword())
                    .authorities("ROLE_USER")
                    .build();

            // Criar claims adicionais
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", user.getId());
            claims.put("firstName", user.getFirstName());
            claims.put("lastName", user.getLastName());

            // Gerar token JWT real
            String token = jwtTokenUtil.generateToken(userDetails, claims);

            log.info("Login realizado com sucesso para o usuário: {}", user.getEmail());

            return AuthResponse.builder()
                    .token(token)
                    .type("Bearer")
                    .user(convertToUserResponse(user))
                    .build();

        } catch (Exception e) {
            log.error("Erro no login: {}", e.getMessage());
            throw new RuntimeException("Erro na autenticação: " + e.getMessage());
        }
    }

    public AuthResponse register(RegisterRequest request) {
        try {
            // Verificar se o email já existe
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email já cadastrado");
            }

            // Verificar se o username já existe
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username já cadastrado");
            }

            // Criar novo usuário
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setUsername(request.getUsername());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setBio(request.getBio());
            user.setBirthDate(request.getBirthDate());
            user.setRole(User.Role.USER);
            user.setIsActive(true);
            user.setIsEmailVerified(false);
            user.setPoints(0);
            user.setEventsCreated(0);
            user.setEventsAttended(0);
            user.setTotalFriends(0);
            user.setCreatedAt(LocalDateTime.now());

            user = userRepository.save(user);

            // Criar UserDetails para o JWT
            UserBuilder userBuilder = org.springframework.security.core.userdetails.User.withUsername(user.getEmail());
            UserDetails userDetails = userBuilder
                    .password(user.getPassword())
                    .authorities("ROLE_USER")
                    .build();

            // Criar claims adicionais
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", user.getId());
            claims.put("firstName", user.getFirstName());
            claims.put("lastName", user.getLastName());

            // Gerar token JWT real
            String token = jwtTokenUtil.generateToken(userDetails, claims);

            log.info("Usuário registrado com sucesso: {}", user.getEmail());

            return AuthResponse.builder()
                    .token(token)
                    .type("Bearer")
                    .user(convertToUserResponse(user))
                    .build();

        } catch (Exception e) {
            log.error("Erro no registro: {}", e.getMessage());
            throw new RuntimeException("Erro no registro: " + e.getMessage());
        }
    }

    private UserResponse convertToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .phoneNumber(user.getPhoneNumber())
                .bio(user.getBio())
                .profilePicture(user.getProfilePicture())
                .birthDate(user.getBirthDate())
                .isActive(user.getIsActive())
                .isEmailVerified(user.getIsEmailVerified())
                .eventsCreated(user.getEventsCreated())
                .eventsAttended(user.getEventsAttended())
                .totalFriends(user.getTotalFriends())
                .points(user.getPoints())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
} 