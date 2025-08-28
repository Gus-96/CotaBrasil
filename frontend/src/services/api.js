import axios from 'axios';

// Formata números
export const formatNumber = (value, minDigits = 2, maxDigits = 2) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits
  }).format(value);
};

// Formata data/hora
export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
};

// Valores iniciais
export const initialQuotes = {
  dollar: { price: '--', change: '--', changePercent: '--', updatedAt: '--' },
  euro: { price: '--', change: '--', changePercent: '--', updatedAt: '--' },
  peso: { price: '--', change: '--', changePercent: '--', updatedAt: '--' },
  ibovespa: { points: '--', change: '--', changePercent: '--', updatedAt: '--' },
  bitcoin: { price: '--', change: '--', changePercent: '--', updatedAt: '--' },
  nasdaq: { points: '--', change: '--', changePercent: '--', updatedAt: '--' }
};

// Busca dados da NASDAQ
export const fetchNasdaqData = async () => {
  try {
    const response = await axios.get('https://cotabrasil-backend.onrender.com/api/nasdaq', { 
      timeout: 8000 
    });
    
    if (response.data?.points) {
      const points = parseFloat(response.data.points.replace(',', '.'));
      const change = parseFloat(response.data.change.replace(',', '.'));
      
      return {
        points: formatNumber(points, 2, 2),
        change: formatNumber(change, 2, 2),
        changePercent: parseFloat(response.data.changePercent).toFixed(2),
        updatedAt: new Date(response.data.updatedAt).toLocaleTimeString('pt-BR')
      };
    }
    
    return initialQuotes.nasdaq;
    
  } catch (error) {
        console.error('Erro ao buscar dados da NASDAQ:', error);
        return initialQuotes.nasdaq;
  }
};

// Processa dados de moedas
export const processCurrencyData = (currencyData, currencyKey, isBitcoin = false) => {
  if (!currencyData || !currencyData[currencyKey]) {
    return initialQuotes[isBitcoin ? 'bitcoin' : 'dollar'];
  }
  
  const currency = currencyData[currencyKey];
  const isPeso = currencyKey === 'ARSBRL';
  
  return {
    price: isPeso 
      ? parseFloat(currency.bid).toFixed(4).replace('.', ',')
      : formatNumber(parseFloat(currency.bid)),
    change: isPeso
      ? parseFloat(currency.varBid).toFixed(6)
      : isBitcoin
        ? formatNumber(parseFloat(currency.varBid))
        : parseFloat(currency.varBid).toFixed(4),
    changePercent: isPeso
      ? parseFloat(currency.pctChange).toFixed(6)
      : parseFloat(currency.pctChange).toFixed(isBitcoin ? 2 : 4),
    updatedAt: formatDate(currency.create_date)
  };
};

// Processa dados do Ibovespa
export const processIbovespaData = (ibovespaData) => {
  if (!ibovespaData) return initialQuotes.ibovespa;
  
  return {
    points: formatNumber(parseFloat(ibovespaData.points)),
    change: formatNumber(parseFloat(ibovespaData.change)),
    changePercent: parseFloat(ibovespaData.changePercent).toFixed(2),
    updatedAt: new Date(ibovespaData.updatedAt).toLocaleTimeString('pt-BR')
  };
};