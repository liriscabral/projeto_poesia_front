import React from 'react';
import '../css/Campo.css';

function Campo({ label, type, value, onChange, name, placeholder }) {
  return (
    <div className="campo">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}

export default Campo; 