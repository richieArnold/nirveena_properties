import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const AlertMessage = ({ message, type, onClose }) => {
  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-400" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-400" />
    }
  };

  const style = styles[type] || styles.success;

  return (
    <div className={`mb-6 ${style.bg} border ${style.border} rounded-lg p-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${style.text}`}>{message}</p>
        </div>
        <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AlertMessage;