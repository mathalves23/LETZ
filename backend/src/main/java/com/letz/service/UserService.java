package com.letz.service;

import com.letz.dto.user.UserResponse;
import com.letz.entity.User;
import com.letz.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço para gerenciamento de usuários
 */
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserResponse convertToUserResponse(User user) {
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

    public List<UserResponse> convertToUserResponseList(List<User> users) {
        return users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> searchUsers(String searchTerm) {
        List<User> users = userRepository.searchUsers(searchTerm);
        return convertToUserResponseList(users);
    }

    public List<UserResponse> getRanking() {
        List<User> users = userRepository.findUsersOrderByPointsDesc();
        return convertToUserResponseList(users);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return convertToUserResponse(user);
    }

    public UserResponse updateUser(Long id, UserResponse userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Atualizar campos que podem ser editados
        if (userDto.getFirstName() != null) {
            user.setFirstName(userDto.getFirstName());
        }
        if (userDto.getLastName() != null) {
            user.setLastName(userDto.getLastName());
        }
        if (userDto.getBio() != null) {
            user.setBio(userDto.getBio());
        }
        if (userDto.getPhoneNumber() != null) {
            user.setPhoneNumber(userDto.getPhoneNumber());
        }
        if (userDto.getProfilePicture() != null) {
            user.setProfilePicture(userDto.getProfilePicture());
        }

        user = userRepository.save(user);
        return convertToUserResponse(user);
    }
} 