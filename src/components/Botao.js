import React from 'react';
import '../css/Botao.css';

function Botao({ texto, onClick, tipo = 'button' }) {
  return (
    <button className="botao" type={tipo} onClick={onClick}>
      {texto}
    </button>
  );
}

export default Botao; 