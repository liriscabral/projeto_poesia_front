import { useEffect } from 'react';
import './Alerta.css';
import { FaCheck, FaTimes, FaExclamation } from 'react-icons/fa';

const Alerta = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch(type) {
      case 'error':
        return <FaTimes className="alert-icon" />;
      case 'warning':
        return <FaExclamation className="alert-icon" />;
      case 'success':
        return <FaCheck className="alert-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className={`alerta alert-${type}`}>
      <div className="alert-content">
        {getIcon()}
        <span>{message}</span>
      </div>
      <button 
        className="alert-close" 
        onClick={onClose}
        aria-label="Fechar alerta"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Alerta;
