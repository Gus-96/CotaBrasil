package com.yourapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Classe de configuração do Spring
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Configura políticas CORS (Cross-Origin Resource Sharing)
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")          // Aplica a todas as rotas da API
                .allowedOrigins("*")            // Permite acesso de qualquer origem
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");  // Métodos HTTP permitidos
    }

    // Cria bean RestTemplate para fazer requisições HTTP
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();  // Instância padrão do RestTemplate
    }
}