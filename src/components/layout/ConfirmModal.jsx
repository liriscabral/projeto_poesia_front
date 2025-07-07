import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title || 'Confirmação'}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="modal-btn confirm" onClick={onConfirm}>Confirmar</button>
          <button className="modal-btn cancel" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 