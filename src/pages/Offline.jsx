import React from 'react';

const Offline = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-lg text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Você está offline
        </h1>
        <p className="text-gray-300 mb-8">
          Parece que você perdeu a conexão com a internet. Verifique sua conexão e tente novamente.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
};

export default Offline;