import React from 'react';
import { useServiceWorker } from '../hooks/useServiceWorker';
import { Transition } from '@headlessui/react';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

const UpdateNotification = () => {
  const {
    newVersionAvailable,
    updateServiceWorker,
    updateStatus,
    isUpdating,
    isChecking
  } = useServiceWorker();

  if (!newVersionAvailable && !isUpdating && !isChecking) return null;

  return (
    <Transition
      show={true}
      enter="transition ease-out duration-300"
      enterFrom="transform translate-y-full opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition ease-in duration-200"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform translate-y-full opacity-0"
    >
      <div className="fixed bottom-4 right-4 max-w-sm w-full bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {isChecking ? (
              <CloudArrowUpIcon className="h-6 w-6 text-blue-400 animate-pulse" />
            ) : isUpdating ? (
              <CloudArrowUpIcon className="h-6 w-6 text-green-400 animate-spin" />
            ) : (
              <CloudArrowUpIcon className="h-6 w-6 text-yellow-400" />
            )}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-100">
              {isChecking
                ? 'Verificando atualizações...'
                : isUpdating
                ? 'Aplicando atualização...'
                : 'Nova versão disponível!'}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {isChecking
                ? 'Aguarde um momento...'
                : isUpdating
                ? 'O app será atualizado em instantes'
                : 'Clique para atualizar o app agora'}
            </p>
          </div>
          {newVersionAvailable && !isUpdating && !isChecking && (
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-indigo-600 rounded px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={updateServiceWorker}
              >
                Atualizar
              </button>
              <button
                className="ml-3 text-gray-400 hover:text-gray-300"
                onClick={() => {/* Adicionar função para fechar notificação */}}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Transition>
  );
};

export default UpdateNotification;