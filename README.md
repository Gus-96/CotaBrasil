<img width="1195" height="632" alt="Captura de Tela 2025-08-29 às 15 42 00" src="https://github.com/user-attachments/assets/0ab845d2-7196-455d-a0be-260ba3c63215" />

# CotaBrasil - Monitoramento Financeiro em Tempo Real

O CotaBrasil é uma solução tecnológica completa desenvolvida para acompanhamento em tempo real dos principais indicadores financeiros que impactam o mercado brasileiro e internacional. Este projeto full-stack combina um frontend moderno em React com um backend robusto em Java Spring Boot, oferecendo aos usuários uma visão abrangente e atualizada do cenário econômico.

A aplicação destaca-se por sua capacidade de integrar múltiplas fontes de dados financeiros em uma única interface intuitiva. No frontend, desenvolvido com React e Tailwind CSS, os usuários podem visualizar de forma clara e organizada as cotações do dólar, euro, peso argentino e bitcoin, além dos índices IBOVESPA e NASDAQ. O design responsivo garante uma experiência consistente em qualquer dispositivo, enquanto o toggle entre modos claro e escuro proporciona conforto visual personalizável.

### URLs de Produção
https://cotabrasil-frontend.onrender.com

## Funcionalidades Principais
Frontend
- Cotações em tempo real de moedas (Dólar, Euro, Peso Argentino)
- Índices bursáteis (IBOVESPA, NASDAQ via Yahoo Finance)
- Criptomoedas (Bitcoin)
- Atualização automática a cada 5 minutos
- Modo claro e escuro
- Design responsivo com Tailwind
- Visualização de variações (valor absoluto e percentual)

Backend
- Integração com Yahoo Finance API
- Tratamento robusto de erros
- Configuração CORS para produção
- Health check endpoints

## Tecnologias Utilizadas
Frontend
- React.js
- Tailwind CSS
- Axios
- React Icons
- Context API (gerenciamento de tema)

Backend
- Java 21 - Linguagem de programação
- Spring Boot 3.2.0 - Framework backend
- Maven - Gerenciamento de dependências
- RestTemplate - Consumo de APIs externas
- Yahoo Finance API - Fonte de dados financeiros

## Roadmap
- Integração com APIs financeiras (Done)
- Layout responsivo (Done)
- Dark mode (Done)
- Gráficos históricos (To Do)
- Guardar Histórico de Cotações no Banco de Dados PostgreSQL (To Do)
