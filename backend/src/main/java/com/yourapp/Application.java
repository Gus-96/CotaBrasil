package com.yourapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Classe principal que inicia a aplicação Spring Boot
@SpringBootApplication  // Habilita configuração automática e componente scan
public class Application {
    
    // Método principal - ponto de entrada da aplicação
    public static void main(String[] args) {
        // Inicia o servidor e a aplicação Spring
        SpringApplication.run(Application.class, args);
    }
}