import { useEffect } from 'react';
import './Alerta.css';

const Alerta = ({ message, type, onClose = () => {} }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <span className="alert-icon">
          {type === 'error' ? '❌' : 
           type === 'warning' ? '⚠️' : 
           type === 'success' ? '✅' : null}
        </span>
        <span className="alert-message">{message}</span>
      </div>
      <button 
        className="alert-close" 
        onClick={onClose}
        aria-label="Fechar alerta"
      >
        &times;
      </button>
    </div>
  );
};

export default Alerta;
