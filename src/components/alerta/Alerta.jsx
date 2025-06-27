import { useEffect } from 'react';
import './Alerta.css';

const Alerta = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch(type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return null;
    }
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <span className="alert-icon">{getIcon()}</span>
        <span>{message}</span>
      </div>
      <button 
        className="alert-close" 
        onClick={onClose}
        aria-label="Fechar alerta"
      >
        ×
      </button>
    </div>
  );
};

export default Alerta;
