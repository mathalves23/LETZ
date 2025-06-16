package com.letz;

import com.letz.entity.User;
import com.letz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

/**
 * Classe principal da aplicação LETZ
 * Organizador de eventos sociais
 */
@SpringBootApplication
public class LetzApplication {

    public static void main(String[] args) {
        SpringApplication.run(LetzApplication.class, args);
        System.out.println("🎉 LETZ Backend iniciado com sucesso!");
        System.out.println("📖 Documentação da API: http://localhost:8080/api/swagger-ui.html");
    }

    @Bean
    public CommandLineRunner initData(@Autowired UserRepository userRepository, 
                                     @Autowired PasswordEncoder passwordEncoder) {
        return args -> {
            // Criar usuários de teste apenas se não existirem
            if (userRepository.count() == 0) {
                
                User admin = User.builder()
                    .email("admin@letz.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("Admin")
                    .lastName("LETZ")
                    .username("admin")
                    .role(User.Role.ADMIN)
                    .isActive(true)
                    .isEmailVerified(true)
                    .points(1000)
                    .eventsCreated(5)
                    .eventsAttended(10)
                    .totalFriends(3)
                    .birthDate(LocalDateTime.of(1990, 1, 1, 0, 0))
                    .bio("Administrador do sistema LETZ")
                    .build();
                
                User joao = User.builder()
                    .email("joao@exemplo.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("João")
                    .lastName("Silva")
                    .username("joao_silva")
                    .role(User.Role.USER)
                    .isActive(true)
                    .isEmailVerified(true)
                    .points(450)
                    .eventsCreated(3)
                    .eventsAttended(8)
                    .totalFriends(12)
                    .birthDate(LocalDateTime.of(1995, 5, 15, 0, 0))
                    .bio("Adoro organizar churrascos!")
                    .build();
                
                User maria = User.builder()
                    .email("maria@exemplo.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("Maria")
                    .lastName("Santos")
                    .username("maria_santos")
                    .role(User.Role.USER)
                    .isActive(true)
                    .isEmailVerified(true)
                    .points(680)
                    .eventsCreated(4)
                    .eventsAttended(15)
                    .totalFriends(18)
                    .birthDate(LocalDateTime.of(1993, 8, 22, 0, 0))
                    .bio("Festeira oficial! 🎉")
                    .build();
                
                User pedro = User.builder()
                    .email("pedro@exemplo.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("Pedro")
                    .lastName("Costa")
                    .username("pedro_costa")
                    .role(User.Role.USER)
                    .isActive(true)
                    .isEmailVerified(true)
                    .points(320)
                    .eventsCreated(2)
                    .eventsAttended(6)
                    .totalFriends(8)
                    .birthDate(LocalDateTime.of(1997, 3, 10, 0, 0))
                    .bio("Organizador de jantares especiais")
                    .build();
                
                userRepository.save(admin);
                userRepository.save(joao);
                userRepository.save(maria);
                userRepository.save(pedro);
                
                System.out.println("✅ Usuários de teste criados com sucesso!");
                System.out.println("📱 Frontend: http://localhost:3005");
                System.out.println("🔧 Backend: http://localhost:5005/api");
                System.out.println("📚 Swagger: http://localhost:5005/api/swagger-ui.html");
                System.out.println("🗄️ H2 Console: http://localhost:5005/api/h2-console");
                System.out.println("👥 Login com: admin@letz.com / admin123");
            }
        };
    }
} 