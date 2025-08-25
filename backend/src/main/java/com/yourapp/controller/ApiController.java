package com.yourapp.controller;

import com.yourapp.service.YahooFinanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    private YahooFinanceService yahooFinanceService;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/ibovespa")
    public ResponseEntity<?> getIbovespa() {
        try {
            Map<String, Object> ibovespaData = yahooFinanceService.getIbovespaData();
            return ResponseEntity.ok(ibovespaData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Erro ao buscar dados da IBOVESPA",
                "details", e.getMessage()
            ));
        }
    }
}