import { useState, useEffect } from 'react';
import './Postform.css';
import Alert from '../alerta/Alerta';
import { categoriaService } from '../../services/api/Api';
import Button from '../button/Button';

function PostForm({ onPublish, usuarioId, onClose }) {
  const [texto, setTexto] = useState('');
  const [titulo, setTitulo] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
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
        setCategorias(response);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setAlert({
          message: error.response?.data?.message || 'Erro ao carregar categorias. Tente recarregar a página.',
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
    
    const trimmedTitulo = titulo.trim();
    const trimmedTexto = texto.trim();
    
    if (!trimmedTitulo || trimmedTitulo.length < 3) {
      setAlert({
        message: 'O título deve ter pelo menos 3 caracteres',
        type: 'error'
      });
      return;
    }
    
    if (!categoriaId) {
      setAlert({
        message: 'Por favor, selecione uma categoria',
        type: 'error'
      });
      return;
    }
    
    if (!trimmedTexto || trimmedTexto.length < 10) {
      setAlert({
        message: 'A poesia deve ter pelo menos 10 caracteres',
        type: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      await onPublish({ 
        titulo: trimmedTitulo, 
        conteudo: trimmedTexto,  
        categoriaId: categoriaId,
        usuarioId: usuarioId   
      });
      setTexto('');
      setTitulo('');
      setCategoriaId('');
      setAlert({
        message: 'Poesia publicada com sucesso!',
        type: 'success'
      });
    } catch (error) {
      setAlert({ 
        message: error.response?.data?.message || 
               error.message || 
               'Erro ao publicar poesia. Tente novamente.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategoria = async (e) => {
    e.preventDefault();
    
    const categoriaTrimmed = novaCategoria.trim();
    if (!categoriaTrimmed) {
      setAlert({ message: 'Por favor, insira um nome para a nova categoria', type: 'error' });
      return;
    }

    if (categorias.some(cat => cat.nome.toLowerCase() === categoriaTrimmed.toLowerCase())) {
      setAlert({ message: 'Esta categoria já existe', type: 'error' });
      return;
    }

    try {
      setIsAddingCategory(true);
      const response = await categoriaService.salvarCategoria({ 
        nome: categoriaTrimmed, 
        usuarioId
      });
      
      setCategoriaId(response.id);
      setNovaCategoria('');
      setCategorias([...categorias, response]);
      setAlert({ message: 'Nova categoria adicionada com sucesso!', type: 'success' });
    } catch (error) {
      setAlert({ 
        message: error.response?.data?.message || 
               error.message || 
               'Erro ao adicionar nova categoria', 
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
            maxLength={100}
            required
          />
          
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="form-select"
            disabled={loading || isAddingCategory}
            required
          >
            <option value="">Selecione uma categoria *</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
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
              maxLength={50}
            />
            <button
              onClick={handleAddCategoria}
              className="add-category-button"
              type="button"
              disabled={loading || isAddingCategory || !novaCategoria.trim()}
              aria-label="Adicionar nova categoria"
            >
              {isAddingCategory ? '...' : '+'}
            </button>
          </div>
        </div>
        
        <textarea
          placeholder="Compartilhe sua poesia... *"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={5}
          disabled={loading}
          maxLength={2000}
          required
        />
        
        <div className="form-actions">
          <Button 
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading || isAddingCategory}
          >
            Voltar
          </Button>
          <Button 
            type="submit"
            variant="primary"
            disabled={loading || isAddingCategory}
            loading={loading}
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;