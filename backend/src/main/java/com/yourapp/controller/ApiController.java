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
    public ResponseEntity<Map<String, Object>> getNasdaq() {
        try {
            URL url = new URL("https://query1.finance.yahoo.com/v8/finance/chart/%5EIXIC");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");
            
            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String response = reader.lines().collect(Collectors.joining());
            reader.close();
            
            // Parse do JSON
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response);
            
            // Extrai dados necessários
            JsonNode metaNode = rootNode.path("chart").path("result").get(0).path("meta");
            double currentPrice = metaNode.path("regularMarketPrice").asDouble();
            double previousClose = metaNode.path("chartPreviousClose").asDouble();
            long timestamp = metaNode.path("regularMarketTime").asLong() * 1000;
            
            // Calcula variações
            double change = currentPrice - previousClose;
            double changePercent = (change / previousClose) * 100;
            
            // Formata resposta
            Map<String, Object> processedData = Map.of(
                "points", String.format("%.2f", currentPrice).replace(".", ","),
                "change", String.format("%.2f", change).replace(".", ","),
                "changePercent", String.format("%.2f", changePercent),
                "updatedAt", new Date(timestamp).toString()
            );
            
            return ResponseEntity.ok(processedData);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error fetching NASDAQ data",
                "details", e.getMessage()
            ));
        }
    }
}