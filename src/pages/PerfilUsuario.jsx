import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoLogOutOutline, IoTrashOutline, IoArrowBackOutline, IoCreateOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import './PerfilUsuario.css';

function PerfilUsuario() {
  const [activeTab, setActiveTab] = useState('categorias');
  const [categorias, setCategorias] = useState([]);
  const [poesias, setPoesias] = useState([]);
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
        await carregarPoesias();
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

  const carregarPoesias = async () => {
    try {
      const response = await fetch(`http://localhost:8080/poema/autor/${usuario.id}`);
      
      if (response.status === 204) {
        setPoesias([]);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const poesiasOrdenadas = ordenarPoesias(data, sortOrder);
      setPoesias(poesiasOrdenadas);
    } catch (error) {
      console.error('Erro ao carregar poesias:', error);
      setPoesias([]);
    }
  };

  const ordenarPoesias = (poesias, ordem) => {
    return [...poesias].sort((a, b) => {
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
        
        if (errorText.includes('poesias associadas')) {
          alert('Não é possível excluir esta categoria pois existem poesias associadas a ela. Delete as poesias primeiro.');
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

  const deletarPoesia = async (poesiaId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta poesia?')) {
      return;
    }

    try {
      console.log('Tentando deletar poesia:', poesiaId, 'do usuário:', usuario.id);
      
      const response = await fetch(`http://localhost:8080/poema/${poesiaId}/${usuario.id}`, {
        method: 'DELETE'
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        console.log('Poesia deletada com sucesso');
        setPoesias(prevPoesias => prevPoesias.filter(poesia => poesia.id !== poesiaId));
        setTimeout(() => carregarPoesias(), 100);
      } else {
        const errorText = await response.text();
        console.error('Erro na resposta:', errorText);
        
        if (errorText.includes('permissão')) {
          alert('Você não tem permissão para excluir esta poesia.');
        } else if (errorText.includes('não encontrado')) {
          alert('Poesia não encontrada.');
        } else {
          alert(`Erro ao excluir poesia: ${errorText}`);
        }
      }
    } catch (error) {
      console.error('Erro ao deletar poesia:', error);
      alert('Erro de conexão ao excluir poesia. Verifique se o servidor está rodando.');
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
    if (activeTab === 'poesias') {
      const poesiasOrdenadas = ordenarPoesias(poesias, order);
      setPoesias(poesiasOrdenadas);
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
              className={`tab ${activeTab === 'poesias' ? 'active' : ''}`}
              onClick={() => handleTabChange('poesias')}
            >
              Minhas Poesias
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

            {activeTab === 'poesias' && (
              <div className="poesias-section">
                <div className="poesias-header">
                  <h2>Minhas Poesias</h2>
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
                  <p>Carregando poesias...</p>
                ) : poesias.length === 0 ? (
                  <p>Você ainda não criou nenhuma poesia.</p>
                ) : (
                  <div className="poesias-list">
                    {poesias.map((poesia) => (
                      <div key={poesia.id} className="poesia-item">
                        <div className="poesia-info">
                          <div style={{ marginBottom: '6px' }}>
                            {poesia.titulo && poesia.categoria ? (
                              <h3 className="poesia-titulo" style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.5px' }}>
                                {poesia.titulo} - {typeof poesia.categoria === 'object' && poesia.categoria !== null ? poesia.categoria.nome : poesia.categoria}
                              </h3>
                            ) : poesia.titulo ? (
                              <h3 className="poesia-titulo" style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.5px' }}>
                                {poesia.titulo}
                              </h3>
                            ) : poesia.categoria ? (
                              <h3 className="poesia-titulo" style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.5px' }}>
                                {typeof poesia.categoria === 'object' && poesia.categoria !== null ? poesia.categoria.nome : poesia.categoria}
                              </h3>
                            ) : null}
                          </div>
                          <p className="poesia-conteudo" style={{ whiteSpace: 'pre-wrap' }}>{poesia.conteudo}</p>
                          <span className="poesia-data">
                            {new Date(poesia.data).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <button 
                          className="delete-btn"
                          onClick={() => deletarPoesia(poesia.id)}
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