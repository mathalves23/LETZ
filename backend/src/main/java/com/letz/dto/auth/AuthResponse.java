package com.letz.dto.auth;

import com.letz.dto.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para resposta de autenticação
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private UserResponse user;
    private String message;

    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
        this.message = "Login realizado com sucesso";
    }
} 