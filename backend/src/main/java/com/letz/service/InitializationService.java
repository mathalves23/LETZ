package com.letz.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class InitializationService implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        log.info("🚀 Iniciando LETZ Backend...");
        
        try {
            // TODO: Futuras inicializações podem ser adicionadas aqui
            // gamificationService.initializeDefaultAchievements();
            // templateService.initializeDefaultTemplates();
            // socialService.initializeSocialIntegrations();
            
            log.info("🎉 LETZ Backend inicializado com sucesso!");
            
        } catch (Exception e) {
            log.error("❌ Erro ao inicializar: {}", e.getMessage(), e);
        }
    }
} 