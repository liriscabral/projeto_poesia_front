import React, { useState, useEffect } from 'react';
import './Postform.css';
import { categoriaService } from '../../services/api/Api';
import { poemaService } from '../../services/api/Api';

function PostForm({ usuarioId, onPublish, mostrarAlerta }) {  // Adicionamos mostrarAlerta nas props
  const [texto, setTexto] = useState('');
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    const carregarCategorias = async () => {
      setLoading(true);
      try {
        const response = await categoriaService.listarCategorias();
        setCategorias(response);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        mostrarAlerta('Erro ao carregar categorias. Tente recarregar a página.', 'error');
      } finally {
        setLoading(false);
      }
    };
    carregarCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      mostrarAlerta('Por favor, insira um título para sua poesia', 'warning');
      return;
    }
    if (!categoria) {
      mostrarAlerta('Por favor, selecione ou crie uma categoria', 'warning');
      return;
    }
    if (!texto.trim()) {
      mostrarAlerta('Por favor, escreva sua poesia antes de publicar', 'warning');
      return;
    }
    try {
      setLoading(true);
      await poemaService.cadastrarPoema({
        titulo,
        conteudo: texto,
        autor: usuarioId,
        categoria: categoria
      });
      setTexto('');
      setTitulo('');
      setCategoria('');
      mostrarAlerta('Poesia publicada com sucesso!', 'success');
      if (onPublish) {
        onPublish();
      }
    } catch (error) {
      mostrarAlerta(error.message || 'Erro ao publicar poesia. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategoria = async (e) => {
    e.preventDefault();
    if (!novaCategoria.trim()) {
      mostrarAlerta('Por favor, insira um nome para a nova categoria', 'warning');
      return;
    }
    if (categorias.some(cat => cat.nome.toLowerCase() === novaCategoria.toLowerCase())) {
      mostrarAlerta('Esta categoria já existe', 'warning');
      return;
    }
    try {
      setIsAddingCategory(true);
      const nova = await categoriaService.salvarCategoria({ nome: novaCategoria, usuarioId });
      setCategorias([...categorias, nova]);
      setCategoria(nova.id);
      setNovaCategoria('');
      mostrarAlerta('Nova categoria adicionada com sucesso!', 'success');
    } catch (error) {
      mostrarAlerta(error.message || 'Erro ao adicionar nova categoria', 'error');
    } finally {
      setIsAddingCategory(false);
    }
  };

  return (
    <div className="post-form-container">
      <h3 style={{ color: '#1da1f2', marginBottom: '12px', fontWeight: 700, fontSize: '1.1rem' }}>
        Nova Poesia
      </h3>
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
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
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