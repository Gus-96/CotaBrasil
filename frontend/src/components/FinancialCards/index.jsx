import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTheme from '../../hooks/useTheme';
import QuoteCard from './QuoteCard';
import Header from './Header';
import LoadingSkeletons from './LoadingSkeletons';
import ErrorState from './ErrorState';
import { 
  initialQuotes, 
  processCurrencyData, 
  processIbovespaData, 
  fetchNasdaqData 
} from '../../services/api';

const FinancialCards = () => {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode, toggleTheme } = useTheme();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoints = [
        axios.get('https://cotabrasil-backend.onrender.com/api/ibovespa', { timeout: 8000 }),
        axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,ARS-BRL,BTC-BRL', { timeout: 8000 }),
        fetchNasdaqData()
      ];

      const [ibovespaResponse, currenciesResponse, nasdaqResponse] = await Promise.allSettled(endpoints);

      const currencies = currenciesResponse.status === 'fulfilled' ? currenciesResponse.value.data : null;
      const ibovespaData = ibovespaResponse.status === 'fulfilled' ? ibovespaResponse.value.data : null;
      const nasdaqData = nasdaqResponse.status === 'fulfilled' ? nasdaqResponse.value : initialQuotes.nasdaq;

      setQuotes({
        dollar: processCurrencyData(currencies, 'USDBRL'),
        euro: processCurrencyData(currencies, 'EURBRL'),
        peso: processCurrencyData(currencies, 'ARSBRL'),
        bitcoin: processCurrencyData(currencies, 'BTCBRL', true),
        ibovespa: processIbovespaData(ibovespaData),
        nasdaq: nasdaqData
      });

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Erro ao carregar cotações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Header 
        darkMode={darkMode} 
        toggleTheme={toggleTheme} 
        loading={loading} 
        onRefresh={fetchData} 
      />
      
      {error ? (
        <ErrorState error={error} onRetry={fetchData} />
      ) : loading ? (
        <LoadingSkeletons />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <QuoteCard 
            title="IBOVESPA (IBOV)" 
            value={quotes.ibovespa.points} 
            variation={quotes.ibovespa.changePercent} 
            change={quotes.ibovespa.change}
            updatedAt={quotes.ibovespa.updatedAt}
            isCurrency={false}
          />
          <QuoteCard 
            title="Dólar Comercial (USD)" 
            value={quotes.dollar.price} 
            variation={quotes.dollar.changePercent} 
            change={quotes.dollar.change}
            updatedAt={quotes.dollar.updatedAt} 
          />
          <QuoteCard 
            title="Euro (EUR)" 
            value={quotes.euro.price} 
            variation={quotes.euro.changePercent} 
            change={quotes.euro.change}
            updatedAt={quotes.euro.updatedAt} 
          />
          <QuoteCard 
            title="NASDAQ Composite" 
            value={quotes.nasdaq.points} 
            variation={quotes.nasdaq.changePercent} 
            change={quotes.nasdaq.change}
            updatedAt={quotes.nasdaq.updatedAt}
            isCurrency={false}
          />
          <QuoteCard 
            title="Bitcoin (BTC)" 
            value={quotes.bitcoin.price} 
            variation={quotes.bitcoin.changePercent} 
            change={quotes.bitcoin.change}
            updatedAt={quotes.bitcoin.updatedAt}
          />
          <QuoteCard 
            title="Peso Argentino (ARS)" 
            value={quotes.peso.price} 
            variation={quotes.peso.changePercent} 
            change={quotes.peso.change}
            updatedAt={quotes.peso.updatedAt}
          />
        </div>
      )}
    </div>
  );
};

export default FinancialCards;