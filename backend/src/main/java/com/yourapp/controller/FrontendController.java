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

@Controller
public class FrontendController {

    private final Path frontendPath;

    public FrontendController() {
        // Tenta diferentes caminhos para o frontend
        Path[] possiblePaths = {
            Paths.get("frontend", "dist"),
            Paths.get("..", "frontend", "dist"),
            Paths.get(System.getProperty("user.dir"), "frontend", "dist")
        };
        
        Path foundPath = null;
        for (Path path : possiblePaths) {
            if (java.nio.file.Files.exists(path)) {
                foundPath = path;
                break;
            }
        }
        
        this.frontendPath = foundPath != null ? foundPath : Paths.get(".");
    }

    @GetMapping("/")
    public String serveFrontend() {
        if (java.nio.file.Files.exists(frontendPath.resolve("index.html"))) {
            return "forward:/index.html";
        } else {
            return "redirect:/api/health";
        }
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = frontendPath.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, 
                        getContentType(filename))
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    private String getContentType(String filename) {
        if (filename.endsWith(".html")) return "text/html";
        if (filename.endsWith(".css")) return "text/css";
        if (filename.endsWith(".js")) return "application/javascript";
        if (filename.endsWith(".png")) return "image/png";
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
        if (filename.endsWith(".gif")) return "image/gif";
        if (filename.endsWith(".svg")) return "image/svg+xml";
        return "application/octet-stream";
    }
}