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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class ApiController {

    private static final Logger logger = LoggerFactory.getLogger(ApiController.class);

    @Autowired
    private YahooFinanceService yahooFinanceService;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Backend Java está funcionando!");
    }

    @GetMapping("/ibovespa")
    public ResponseEntity<?> getIbovespa() {
        try {
            Map<String, Object> ibovespaData = yahooFinanceService.getIbovespaData();
            return ResponseEntity.ok(ibovespaData);
        } catch (Exception e) {
            logger.error("Erro ao buscar IBOVESPA", e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Erro ao buscar dados da IBOVESPA",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/nasdaq")
    public ResponseEntity<String> getNasdaq() {
        try {
            URL url = new URL("https://query1.finance.yahoo.com/v8/finance/chart/%5EIXIC");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);
            
            logger.info("Tentando conectar com Yahoo Finance...");
            logger.info("Response Code: " + conn.getResponseCode());
            logger.info("Response Message: " + conn.getResponseMessage());
            
            if (conn.getResponseCode() != 200) {
                BufferedReader errorReader = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
                String errorResponse = errorReader.lines().collect(Collectors.joining());
                errorReader.close();
                logger.error("Erro HTTP: " + errorResponse);
                return ResponseEntity.status(500).body("Error from Yahoo API: " + conn.getResponseCode());
            }
            
            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String response = reader.lines().collect(Collectors.joining());
            reader.close();
            
            logger.info("Dados recebidos com sucesso");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Erro detalhado ao buscar NASDAQ", e);
            return ResponseEntity.status(500).body("Error fetching NASDAQ data: " + e.getMessage());
        }
    }
}