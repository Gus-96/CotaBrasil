package com.yourapp.controller;

import com.yourapp.service.YahooFinanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Map;
import java.util.stream.Collectors;

// Controlador REST para endpoints da API
@RestController
@RequestMapping("/api")  // Define o caminho base para todos os endpoints
public class ApiController {

    // Injeta o serviço de finanças
    @Autowired
    private YahooFinanceService yahooFinanceService;

    // Endpoint simples para verificar se a API está funcionando
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Backend Java está funcionando!");  // Retorna "OK" se a API estiver ativa
    }

    // Endpoint para obter dados da IBOVESPA
    @GetMapping("/ibovespa")
    public ResponseEntity<?> getIbovespa() {
        try {
            // Busca dados da IBOVESPA através do serviço
            Map<String, Object> ibovespaData = yahooFinanceService.getIbovespaData();
            return ResponseEntity.ok(ibovespaData);  // Retorna dados com status 200
        } catch (Exception e) {
            // Retorna erro 500 com detalhes em caso de falha
            return ResponseEntity.status(500).body(Map.of(
                "error", "Erro ao buscar dados da IBOVESPA",
                "details", e.getMessage()
            ));
        }
    }

    // Endpoint para obter dados da NASDAQ
    @GetMapping("/nasdaq")
    public ResponseEntity<String> getNasdaq() {
        try {
            URL url = new URL("https://query1.finance.yahoo.com/v8/finance/chart/%5EIXIC");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            
            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String response = reader.lines().collect(Collectors.joining());
            reader.close();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching NASDAQ data");
        }
    }
}