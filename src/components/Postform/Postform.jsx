import React, { useState, useEffect } from 'react';
import './Postform.css';
import Alert from '../alerta/Alerta';
import { categoriaService } from '../../services/api/Api';

function PostForm({ onPublish, usuarioId }) {
  const [texto, setTexto] = useState('');
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    const carregarCategorias = async () => {
      setLoading(true);
      try {
        const response = await categoriaService.listarCategorias();
        setCategorias(response.map(cat => cat.nome));
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setAlert({
          message: 'Erro ao carregar categorias. Tente recarregar a página.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    carregarCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!titulo.trim()) {
      setAlert({
        message: 'Por favor, insira um título para sua poesia',
        type: 'error'
      });
      return;
    }
    
    if (!categoria.trim()) {
      setAlert({
        message: 'Por favor, selecione ou crie uma categoria',
        type: 'error'
      });
      return;
    }
    
    if (!texto.trim()) {
      setAlert({
        message: 'Por favor, escreva sua poesia antes de publicar',
        type: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      await onPublish({ titulo, texto, categoria });
      setTexto('');
      setTitulo('');
      setCategoria('');
      setAlert({
        message: 'Poesia publicada com sucesso!',
        type: 'success'
      });
    } catch (error) {
      setAlert({
        message: 'Erro ao publicar poesia. Tente novamente.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategoria = async (e) => {
    e.preventDefault();
    
    if (!novaCategoria.trim()) {
      setAlert({
        message: 'Por favor, insira um nome para a nova categoria',
        type: 'error'
      });
      return;
    }

    if (categorias.some(cat => cat.toLowerCase() === novaCategoria.toLowerCase())) {
      setAlert({
        message: 'Esta categoria já existe',
        type: 'error'
      });
      return;
    }

    try {
      setIsAddingCategory(true);
      await categoriaService.salvarCategoria({ 
        nome: novaCategoria, 
        usuarioId: usuarioId
      });
      
      // Atualiza a lista de categorias sem precisar recarregar tudo
      setCategorias([...categorias, novaCategoria]);
      setCategoria(novaCategoria);
      setNovaCategoria('');
      setAlert({
        message: 'Nova categoria adicionada!',
        type: 'success'
      });
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Erro ao adicionar nova categoria';
      setAlert({
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsAddingCategory(false);
    }
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <div className="post-form-container">
      <h3 style={{ color: '#1da1f2', marginBottom: '12px', fontWeight: 700, fontSize: '1.1rem' }}>
        Nova Poesia
      </h3>
      {alert && (
        <Alert 
          message={alert.message} 
          type={alert.type} 
          onClose={closeAlert}
        />
      )}
      <form className="post-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            placeholder="Título da poesia *"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="form-input"
            disabled={loading}
            required
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="form-select"
            disabled={loading || isAddingCategory}
            required
          >
            <option value="">Selecione uma categoria *</option>
            {categorias.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="new-category-container">
            <input
              type="text"
              placeholder="Nova categoria"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              className="form-input"
              disabled={loading || isAddingCategory}
            />
            <button 
              onClick={handleAddCategoria}
              className="add-category-button"
              type="button"
              disabled={loading || isAddingCategory || !novaCategoria.trim()}
            >
              {isAddingCategory ? '...' : '+'}
            </button>
          </div>
        </div>
        <textarea
          placeholder="Compartilhe sua poesia... *"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows="3"
          disabled={loading}
          required
        />
        <div className="post-form-actions">
          <button 
            type="submit" 
            disabled={loading || isAddingCategory}
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;