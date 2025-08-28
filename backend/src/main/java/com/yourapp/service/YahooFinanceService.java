package com.yourapp.service;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

// Serviço para buscar dados do Yahoo Finance
@Service
public class YahooFinanceService {

    private final RestTemplate restTemplate;

    public YahooFinanceService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Busca dados do IBOVESPA tentando vários símbolos possíveis
    public Map<String, Object> getIbovespaData() {
        // Lista de símbolos alternativos para o IBOVESPA
        String[] symbols = {
            "^BVSP",        // Símbolo direto
            "BVSP",         // Sem o ^
            "%5EIBOV",      // ^IBOV
            "^IBOV",        // IBOV direto
            "IBOV",         // Sem o ^
            "IBOV.SAO"      // Símbolo completo da B3
        };
        
        // Tenta cada símbolo até encontrar um que funcione
        for (String symbol : symbols) {
            try {
                Map<String, Object> result = trySymbol(symbol);
                if (result != null) {
                    return result;  // Retorna ao primeiro sucesso
                }
            } catch (Exception e) {
                System.out.println("Símbolo " + symbol + " falhou: " + e.getMessage());
                continue;  // Continua para o próximo símbolo em caso de erro
            }
        }
        
        // Lança exceção se todos os símbolos falharem
        throw new RuntimeException("Todos os símbolos do IBOVESPA falharam");
    }

    // Tenta buscar dados usando um símbolo específico
    private Map<String, Object> trySymbol(String symbol) {
        try {
            String url = "https://query1.finance.yahoo.com/v8/finance/chart/" + symbol + "?interval=1d";
            
            System.out.println("Tentando símbolo: " + url);
            
            // Configura headers para evitar bloqueio
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            headers.set("Accept", "application/json");
            headers.set("Accept-Language", "en-US,en;q=0.9");
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            // Faz requisição à API do Yahoo Finance
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, Map.class);
            
            Map<String, Object> result = response.getBody();
            
            if (result == null) {
                System.out.println("Resposta vazia para símbolo: " + symbol);
                return null;
            }
            
            // Extrai dados da estrutura de resposta do Yahoo
            Map<String, Object> chart = (Map<String, Object>) result.get("chart");
            if (chart == null) {
                System.out.println("Chart não encontrado para símbolo: " + symbol);
                return null;
            }
            
            // Verifica se há erro na resposta
            Map<String, Object> error = (Map<String, Object>) chart.get("error");
            if (error != null) {
                System.out.println("Erro para símbolo " + symbol + ": " + error.get("description"));
                return null;
            }
            
            java.util.List<Object> results = (java.util.List<Object>) chart.get("result");
            if (results == null || results.isEmpty()) {
                System.out.println("Resultados vazios para símbolo: " + symbol);
                return null;
            }
            
            Map<String, Object> firstResult = (Map<String, Object>) results.get(0);
            Map<String, Object> meta = (Map<String, Object>) firstResult.get("meta");
            
            if (meta == null) {
                System.out.println("Meta não encontrado para símbolo: " + symbol);
                return null;
            }
            
            // Extrai valores numéricos dos dados
            Number regularMarketPriceNum = (Number) meta.get("regularMarketPrice");
            Number previousCloseNum = (Number) meta.get("chartPreviousClose");
            Number regularMarketTimeNum = (Number) meta.get("regularMarketTime");
            
            if (regularMarketPriceNum == null) {
                System.out.println("Preço de mercado não encontrado para símbolo: " + symbol);
                return null;
            }
            
            // Calcula variação e percentual de mudança
            Double regularMarketPrice = regularMarketPriceNum.doubleValue();
            Double previousClose = previousCloseNum != null ? previousCloseNum.doubleValue() : regularMarketPrice;
            Integer regularMarketTime = regularMarketTimeNum != null ? regularMarketTimeNum.intValue() : (int) (System.currentTimeMillis() / 1000);
            
            Double change = regularMarketPrice - previousClose;
            Double changePercent = previousClose != 0 ? (change / previousClose) * 100 : 0.0;
            
            // Formata data de atualização
            String updatedAt = DateTimeFormatter.ISO_INSTANT.format(
                Instant.ofEpochSecond(regularMarketTime));
            
            // Prepara resposta formatada
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("points", regularMarketPrice);
            responseData.put("change", change);
            responseData.put("changePercent", changePercent);
            responseData.put("updatedAt", updatedAt);
            
            System.out.println("Sucesso com símbolo: " + symbol);
            return responseData;
            
        } catch (Exception e) {
            System.out.println("Erro com símbolo " + symbol + ": " + e.getMessage());
            return null;  // Retorna null para tentar próximo símbolo
        }
    }
}