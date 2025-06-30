import React from 'react';
import './Righbar.css';

function Righbar() {
  return (
    <div className="righbar">
      <div className="righbar-header">
        <h3>Sugestões</h3>
      </div>
      <div className="righbar-content">
        <ul>
          <li>poeta_do_amanha</li>
          <li>versoslivres</li>
          <li>delza_poesia</li>
          <li>poesia_moderna</li>
          <li>versos_urbanos</li>
        </ul>
      </div>
    </div>
  );
}

export default Righbar;