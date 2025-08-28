import React from 'react';

const LoadingSkeletons = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white dark:bg-dark-100 p-4 rounded-lg shadow-md animate-pulse min-h-[200px]" />
      ))}
    </div>
  );
};

export default LoadingSkeletons;