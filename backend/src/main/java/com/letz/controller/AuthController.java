package com.letz.controller;

import com.letz.dto.auth.AuthResponse;
import com.letz.dto.auth.LoginRequest;
import com.letz.dto.auth.RegisterRequest;
import com.letz.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller de autenticação
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Endpoints para autenticação de usuários")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Fazer login", description = "Autentica um usuário e retorna um token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder()
                    .message(e.getMessage())
                    .build()
            );
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar usuário", description = "Cria uma nova conta de usuário")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder()
                    .message(e.getMessage())
                    .build()
            );
        }
    }

    @GetMapping("/test")
    @Operation(summary = "Testar API", description = "Endpoint para testar se a API está funcionando")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("API LETZ funcionando! 🎉");
    }
} 