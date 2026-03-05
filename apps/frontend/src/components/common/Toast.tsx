import React from 'react';
import PawlExclamation from '../../assets/pawlExclamation.svg'; // Certifique-se de que o caminho está correto

interface ToastProps {
  id: string;
  message: string;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <div className="w-80 rounded-lg shadow-lg overflow-hidden bg-[#FEFBFB]">
        {/* Barra superior */}
        <div className="bg-[#5451FF] p-2 flex justify-end items-center">
          <button onClick={() => onClose(id)} className="text-white hover:text-gray-200">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Conteúdo principal */}
        <div className="p-4 flex flex-col items-center justify-center space-y-3">
          <img src={PawlExclamation} alt="Exclamation" className="w-12 h-12" />
          <p className="text-center text-gray-700 text-sm font-medium">{message}</p>
          <button
            onClick={() => onClose(id)}
            className="mt-4 px-4 py-2 bg-[#5451FF] text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
