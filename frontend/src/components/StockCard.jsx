import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaSyncAlt, FaMoon, FaSun } from 'react-icons/fa';
import useTheme from '../hooks/useTheme';

const formatNumber = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const FinancialCards = () => {
  const [quotes, setQuotes] = useState({
    dollar: { price: '--', change: '--', changePercent: '--', updatedAt: '--' },
    euro: { price: '--', change: '--', changePercent: '--', updatedAt: '--' },
    peso: { price: '--', change: '--', changePercent: '--', updatedAt: '--' },
    ibovespa: { points: '--', change: '--', changePercent: '--', updatedAt: '--' },
    bitcoin: { price: '--', change: '--', changePercent: '--', updatedAt: '--' },
    nasdaq: { points: '--', change: '--', changePercent: '--', updatedAt: '--' }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode, toggleTheme } = useTheme();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        });
      };

      // API para moedas (incluindo Bitcoin em BRL)
      const currenciesUrl = 'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,ARS-BRL,BTC-BRL';
      
      // API para NASDAQ com proxy para evitar CORS
      const nasdaqProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        'https://query1.finance.yahoo.com/v8/finance/chart/%5EIXIC'
      )}`;

      const [
        currenciesResponse, 
        ibovespaResponse, 
        nasdaqResponse
      ] = await Promise.allSettled([
        axios.get(currenciesUrl),
        axios.get('/api/ibovespa'),
        axios.get(nasdaqProxyUrl)
      ]);

      // Processar dados das moedas
      let dollarData = { price: '--', change: '--', changePercent: '--', updatedAt: '--' };
      let euroData = { price: '--', change: '--', changePercent: '--', updatedAt: '--' };
      let pesoData = { price: '--', change: '--', changePercent: '--', updatedAt: '--' };
      let bitcoinData = { price: '--', change: '--', changePercent: '--', updatedAt: '--' };

      if (currenciesResponse.status === 'fulfilled') {
        const currencies = currenciesResponse.value.data;
        
        dollarData = {
          price: formatNumber(parseFloat(currencies.USDBRL.bid)),
          change: parseFloat(currencies.USDBRL.varBid).toFixed(4),
          changePercent: parseFloat(currencies.USDBRL.pctChange).toFixed(4),
          updatedAt: formatDate(currencies.USDBRL.create_date)
        };

        euroData = {
          price: formatNumber(parseFloat(currencies.EURBRL.bid)),
          change: parseFloat(currencies.EURBRL.varBid).toFixed(4),
          changePercent: parseFloat(currencies.EURBRL.pctChange).toFixed(4),
          updatedAt: formatDate(currencies.EURBRL.create_date)
        };

        pesoData = {
          price: parseFloat(currencies.ARSBRL.bid).toFixed(4).replace('.', ','),
          change: parseFloat(currencies.ARSBRL.bid - currencies.ARSBRL.ask).toFixed(8),
          changePercent: parseFloat(currencies.ARSBRL.pctChange).toFixed(6),
          updatedAt: formatDate(currencies.ARSBRL.create_date)
        };

        bitcoinData = {
          price: formatNumber(parseFloat(currencies.BTCBRL.bid)),
          change: formatNumber(parseFloat(currencies.BTCBRL.varBid)),
          changePercent: parseFloat(currencies.BTCBRL.pctChange).toFixed(2),
          updatedAt: formatDate(currencies.BTCBRL.create_date)
        };
      }

      // Processar dados do IBOVESPA
      let ibovespaData = { points: '--', change: '--', changePercent: '--', updatedAt: '--' };
      
      if (ibovespaResponse.status === 'fulfilled') {
        const ibovespa = ibovespaResponse.value.data;
        ibovespaData = {
          points: formatNumber(parseFloat(ibovespa.points)),
          change: formatNumber(parseFloat(ibovespa.change)),
          changePercent: parseFloat(ibovespa.changePercent).toFixed(2),
          updatedAt: new Date(ibovespa.updatedAt).toLocaleTimeString('pt-BR')
        };
      }

      // Processar dados da NASDAQ
      let nasdaqData = { points: '--', change: '--', changePercent: '--', updatedAt: '--' };
      
      if (nasdaqResponse.status === 'fulfilled') {
        try {
          const nasdaqJson = JSON.parse(nasdaqResponse.value.data.contents);
          const nasdaq = nasdaqJson.chart.result[0].meta;
          const previousClose = nasdaq.chartPreviousClose;
          const currentPrice = nasdaq.regularMarketPrice;
          
          nasdaqData = {
            points: formatNumber(currentPrice),
            change: formatNumber(currentPrice - previousClose),
            changePercent: ((currentPrice - previousClose) / previousClose * 100).toFixed(2),
            updatedAt: new Date(nasdaq.regularMarketTime * 1000).toLocaleTimeString('pt-BR')
          };
        } catch (error) {
          console.error('Error processing NASDAQ data:', error);
        }
      }

      setQuotes({
        dollar: dollarData,
        euro: euroData,
        peso: pesoData,
        ibovespa: ibovespaData,
        bitcoin: bitcoinData,
        nasdaq: nasdaqData
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Erro ao carregar cotações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Atualiza a cada 5 minutos
    return () => clearInterval(interval);
  }, []);

  const QuoteCard = ({ 
    title, 
    value, 
    variation, 
    change, 
    updatedAt, 
    isCurrency = true, 
    currencySymbol = 'R$' 
  }) => {
    const hasValidVariation = variation !== '--' && !isNaN(parseFloat(variation));
    const hasValidChange = change !== '--' && !isNaN(parseFloat(change));

    return (
      <div className="relative bg-white dark:bg-dark-100 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 transition-colors duration-300 min-h-[240px] flex flex-col justify-between">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          {title}
        </h3>

        <div className="flex-grow flex flex-col justify-start space-y-6 pb-10">
          <div className="flex items-end gap-4">
            <span className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
              {isCurrency ? `${currencySymbol} ` : ''}{value}
              {!isCurrency && <span className="text-base ml-1">pts</span>}
            </span>
            {hasValidVariation && (
              <span className={`flex items-center text-lg font-medium ${
                parseFloat(variation) >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
              }`}>
                {parseFloat(variation) >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {Math.abs(parseFloat(variation))}%
              </span>
            )}
          </div>

          {hasValidChange && (
            <div className="text-base text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-semibold">Variação: </span> 
                <span className={parseFloat(change) >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}>
                  {parseFloat(change) >= 0 ? '+ ' : ' '}
                  {change}{isCurrency ? ` ${currencySymbol}` : ''}
                  {!isCurrency && ' pts'}
                </span>
              </p>
            </div>
          )}
        </div>

        <p className="absolute bottom-4 right-6 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">Atualizado:</span> {updatedAt}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Indicadores Financeiros</h2>
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
            aria-label={darkMode ? 'Modo claro' : 'Modo escuro'}
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
          </button>
          <button 
            onClick={fetchData}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-dark-200 transition-colors"
          >
            <FaSyncAlt className={`text-lg ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="text-center py-4">
          <p className="text-red-500 dark:text-red-400 mb-3">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-dark-100 p-4 rounded-lg shadow-md animate-pulse min-h-[200px]"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuoteCard 
            title="BOVESPA (IBOV)" 
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