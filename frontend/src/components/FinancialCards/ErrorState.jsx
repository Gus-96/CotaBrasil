import React from 'react';

const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="text-center py-4">
      <p className="text-red-500 dark:text-red-400 mb-3">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );
};

export default ErrorState;