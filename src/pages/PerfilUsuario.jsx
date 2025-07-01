import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoLogOutOutline, IoTrashOutline, IoArrowBackOutline, IoCreateOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import './PerfilUsuario.css';

function PerfilUsuario() {
  const [activeTab, setActiveTab] = useState('categorias');
  const [categorias, setCategorias] = useState([]);
  const [poemas, setPoemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('recentes');
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  useEffect(() => {
    carregarDados();
  }, [usuario]);

  const carregarDados = async () => {
    if (!usuario) return;
    
    setLoading(true);
    try {
      if (activeTab === 'categorias') {
        await carregarCategorias();
      } else {
        await carregarPoemas();
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarCategorias = async () => {
    try {
      const response = await fetch('http://localhost:8080/categoria');
      const data = await response.json();
      console.log('Categorias recebidas:', data);
      const categoriasUsuario = data.filter(cat => cat.usuarioId === usuario.id);
      console.log('Categorias do usuário:', categoriasUsuario);
      setCategorias(categoriasUsuario);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const carregarPoemas = async () => {
    try {
      const response = await fetch(`http://localhost:8080/poema/autor/${usuario.id}`);
      const data = await response.json();
      const poemasOrdenados = ordenarPoemas(data, sortOrder);
      setPoemas(poemasOrdenados);
    } catch (error) {
      console.error('Erro ao carregar poemas:', error);
    }
  };

  const ordenarPoemas = (poemas, ordem) => {
    return [...poemas].sort((a, b) => {
      const dataA = new Date(a.data);
      const dataB = new Date(b.data);
      return ordem === 'recentes' ? dataB - dataA : dataA - dataB;
    });
  };

  const deletarCategoria = async (categoriaId) => {
    if (!categoriaId) {
      alert('Erro: ID da categoria não encontrado');
      return;
    }

    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      console.log('Tentando deletar categoria:', categoriaId, 'do usuário:', usuario.id);
      
      const response = await fetch(`http://localhost:8080/categoria/${categoriaId}/${usuario.id}`, {
        method: 'DELETE'
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        console.log('Categoria deletada com sucesso');
        await carregarCategorias();
      } else {
        const errorText = await response.text();
        console.error('Erro na resposta:', errorText);
        
        if (errorText.includes('poemas associados')) {
          alert('Não é possível excluir esta categoria pois existem poemas associados a ela. Delete os poemas primeiro.');
        } else if (errorText.includes('permissão')) {
          alert('Você não tem permissão para excluir esta categoria.');
        } else if (errorText.includes('não encontrada')) {
          alert('Categoria não encontrada.');
        } else {
          alert(`Erro ao excluir categoria: ${errorText}`);
        }
      }
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      alert('Erro de conexão ao excluir categoria. Verifique se o servidor está rodando.');
    }
  };

  const deletarPoema = async (poemaId) => {
    if (!window.confirm('Tem certeza que deseja excluir este poema?')) {
      return;
    }

    try {
      console.log('Tentando deletar poema:', poemaId, 'do usuário:', usuario.id);
      
      const response = await fetch(`http://localhost:8080/poema/${poemaId}/${usuario.id}`, {
        method: 'DELETE'
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        console.log('Poema deletado com sucesso');
        await carregarPoemas();
      } else {
        const errorText = await response.text();
        console.error('Erro na resposta:', errorText);
        
        if (errorText.includes('permissão')) {
          alert('Você não tem permissão para excluir este poema.');
        } else if (errorText.includes('não encontrado')) {
          alert('Poema não encontrado.');
        } else {
          alert(`Erro ao excluir poema: ${errorText}`);
        }
      }
    } catch (error) {
      console.error('Erro ao deletar poema:', error);
      alert('Erro de conexão ao excluir poema. Verifique se o servidor está rodando.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleVoltar = () => {
    navigate('/home');
  };

  const handleEditar = () => {
    navigate('/editar-perfil');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    if (activeTab === 'poemas') {
      const poemasOrdenados = ordenarPoemas(poemas, order);
      setPoemas(poemasOrdenados);
    }
  };

  useEffect(() => {
    if (usuario) {
      carregarDados();
    }
  }, [activeTab, usuario]);

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-header">
          <div>
            <h1 className="usuario-user">@{usuario.user}</h1>
          </div>
          <div className="usuario-info">
            <button className="back-btn" onClick={handleVoltar}>
              <IoArrowBackOutline size={16} />
              Voltar
            </button>
            <button className="edit-btn" onClick={handleEditar}>
              <IoCreateOutline size={16} />
              Editar
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <IoLogOutOutline size={16} />
              Sair
            </button>
          </div>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'categorias' ? 'active' : ''}`}
              onClick={() => handleTabChange('categorias')}
            >
              Minhas Categorias
            </button>
            <button 
              className={`tab ${activeTab === 'poemas' ? 'active' : ''}`}
              onClick={() => handleTabChange('poemas')}
            >
              Meus Poemas
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'categorias' && (
              <div className="categorias-section">
                <h2>Minhas Categorias</h2>
                {loading ? (
                  <p>Carregando categorias...</p>
                ) : categorias.length === 0 ? (
                  <p>Você ainda não criou nenhuma categoria.</p>
                ) : (
                  <div className="categorias-list">
                    {categorias.map((categoria) => (
                      <div key={categoria.id} className="categoria-item">
                        <span className="categoria-nome">{categoria.nome}</span>
                        <button 
                          className="delete-btn"
                          onClick={() => deletarCategoria(categoria.id)}
                        >
                          <IoTrashOutline size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'poemas' && (
              <div className="poemas-section">
                <div className="poemas-header">
                  <h2>Meus Poemas</h2>
                  <div className="sort-controls">
                    <span>Ordenar por:</span>
                    <button 
                      className={`sort-btn ${sortOrder === 'recentes' ? 'active' : ''}`}
                      onClick={() => handleSortChange('recentes')}
                    >
                      Mais Recentes
                    </button>
                    <button 
                      className={`sort-btn ${sortOrder === 'antigos' ? 'active' : ''}`}
                      onClick={() => handleSortChange('antigos')}
                    >
                      Mais Antigos
                    </button>
                  </div>
                </div>

                {loading ? (
                  <p>Carregando poemas...</p>
                ) : poemas.length === 0 ? (
                  <p>Você ainda não criou nenhum poema.</p>
                ) : (
                  <div className="poemas-list">
                    {poemas.map((poema) => (
                      <div key={poema.id} className="poema-item">
                        <div className="poema-info">
                          <h3 className="poema-titulo">{poema.titulo}</h3>
                          <p className="poema-conteudo">{poema.conteudo}</p>
                          <span className="poema-data">
                            {new Date(poema.data).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <button 
                          className="delete-btn"
                          onClick={() => deletarPoema(poema.id)}
                        >
                          <IoTrashOutline size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilUsuario; 