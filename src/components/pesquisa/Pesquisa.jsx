import React from 'react';
import './Pesquisa.css';
import { IoSearchOutline, IoSearchSharp, IoFilter } from 'react-icons/io5';
import { FaPen } from 'react-icons/fa';
import Button from '../button/Button';

function Pesquisa({ 
  searchTerm, 
  setSearchTerm, 
  categorias = [],
  selectedFilter = '',
  setSelectedFilter = () => {},
  toggleFormVisibility
}) {
  const handleCategoryChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  return (
    <div className="pesquisa-container">
      <div className="search-bar">
        <div className="search-icon">
          {searchTerm ? <IoSearchSharp size={18} /> : <IoSearchOutline size={18} />}
        </div>
        <input
          type="text"
          placeholder="Buscar poesias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="pesquisa-actions">
        <div className="category-filter">
          <IoFilter className="filter-icon" size={16} />
          <select
            value={selectedFilter}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="">Todas categorias</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        <Button 
          variant="primary"
          onClick={toggleFormVisibility}
          className="create-poetry-btn"
        >
          <FaPen style={{ marginRight: '8px' }} />
          Criar poesia
        </Button>
      </div>
    </div>
  );
}

export default Pesquisa;