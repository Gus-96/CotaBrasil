import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

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
  const isPositive = hasValidVariation && parseFloat(variation) >= 0;
  const textColor = isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';

  return (
    <div className="relative bg-white dark:bg-dark-100 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 transition-colors duration-300 min-h-[240px] flex flex-col justify-between">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">{title}</h3>

      <div className="flex-grow flex flex-col justify-start space-y-6 pb-10">
        <div className="flex items-end gap-4">
          <span className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
            {isCurrency ? `${currencySymbol} ` : ''}{value}
            {!isCurrency && <span className="text-base ml-1">pts</span>}
          </span>
          {hasValidVariation && (
            <span className={`flex items-center text-lg font-medium ${textColor}`}>
              {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {Math.abs(parseFloat(variation))}%
            </span>
          )}
        </div>

        {hasValidChange && (
          <div className="text-base text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-semibold">Variação: </span> 
              <span className={textColor}>
                {isPositive ? '+ ' : ' '}
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

export default QuoteCard;