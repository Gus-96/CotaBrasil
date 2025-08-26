package com.yourapp.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

// Controlador para servir arquivos do frontend
@Controller
public class FrontendController {

    private final Path frontendPath;

    public FrontendController() {
        // Tenta diferentes caminhos onde o frontend pode estar
        Path[] possiblePaths = {
            Paths.get("frontend", "dist"),              // Diretório local
            Paths.get("..", "frontend", "dist"),        // Diretório irmão
            Paths.get(System.getProperty("user.dir"), "frontend", "dist") // Caminho absoluto
        };
        
        // Procura o primeiro caminho que existe
        Path foundPath = null;
        for (Path path : possiblePaths) {
            if (java.nio.file.Files.exists(path)) {
                foundPath = path;
                break;
            }
        }
        
        // Usa o caminho encontrado ou o diretório atual como fallback
        this.frontendPath = foundPath != null ? foundPath : Paths.get(".");
    }

    // Rota principal - serve o index.html do frontend
    @GetMapping("/")
    public String serveFrontend() {
        if (java.nio.file.Files.exists(frontendPath.resolve("index.html"))) {
            return "forward:/index.html";  // Encaminha para o arquivo estático
        } else {
            return "redirect:/api/health"; // Fallback para API se frontend não existir
        }
    }

    // Serve arquivos estáticos do frontend (CSS, JS, imagens, etc.)
    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = frontendPath.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, 
                        getContentType(filename))  // Define content-type apropriado
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();  // Arquivo não encontrado
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();  // URL mal formada
        }
    }
    
    // Determina o tipo de conteúdo baseado na extensão do arquivo
    private String getContentType(String filename) {
        if (filename.endsWith(".html")) return "text/html";
        if (filename.endsWith(".css")) return "text/css";
        if (filename.endsWith(".js")) return "application/javascript";
        if (filename.endsWith(".png")) return "image/png";
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
        if (filename.endsWith(".gif")) return "image/gif";
        if (filename.endsWith(".svg")) return "image/svg+xml";
        return "application/octet-stream";  // Tipo genérico para outros arquivos
    }
}