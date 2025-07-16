const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

const app = express();

// Configuração básica do servidor
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => res.sendStatus(200));

// Rota para IBOVESPA (Yahoo Finance) - VERSÃO ORIGINAL FUNCIONAL
app.get('/api/ibovespa', async (req, res) => {
  try {
    const response = await axios.get(
      'https://query1.finance.yahoo.com/v8/finance/chart/^BVSP?interval=1d',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0', // Adiciona header para evitar bloqueio
          'Accept': 'application/json'
        }
      }
    );

    const data = response.data.chart.result[0];
    const regularMarketPrice = data.meta.regularMarketPrice;
    const previousClose = data.meta.chartPreviousClose;
    const change = regularMarketPrice - previousClose;
    const changePercent = (change / previousClose) * 100;

    res.json({
      points: regularMarketPrice,
      change,
      changePercent,
      updatedAt: new Date(data.meta.regularMarketTime * 1000).toISOString()
    });

  } catch (error) {
    console.error('Erro ao buscar IBOVESPA:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    res.status(500).json({
      error: 'Erro ao buscar dados da BOVESPA',
      details: error.message
    });
  }
});

// CONFIGURAÇÃO PARA O RENDER (SEM MODIFICAR O COMPORTAMENTO LOCAL)
if (process.env.NODE_ENV === 'production') {
  const frontendPaths = [
    path.join(__dirname, 'frontend', 'dist'),      // Caminho Render
    path.join(__dirname, '..', 'frontend', 'dist') // Caminho local
  ];

  let frontendServed = false;
  
  for (const frontendPath of frontendPaths) {
    if (!frontendServed && fs.existsSync(frontendPath)) {
      app.use(express.static(frontendPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
      });
      console.log(`[RENDER] Frontend servido de: ${frontendPath}`);
      frontendServed = true;
    }
  }

  if (!frontendServed) {
    console.warn('[RENDER] Aviso: Frontend não encontrado. Servindo apenas API.');
  }
}

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro global:', err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nServidor backend rodando na porta ${PORT}`);
  console.log(`Endpoints disponíveis:`);
  console.log(`- http://localhost:${PORT}/api/ibovespa`);
  console.log(`\nModo: ${process.env.NODE_ENV || 'development'}\n`);
});