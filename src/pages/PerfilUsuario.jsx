import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoLogOutOutline, IoTrashOutline, IoArrowBackOutline, IoCreateOutline, IoHeartOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import './PerfilUsuario.css';
import { curtidaService } from '../services/api/Api';
import { FaRegHeart, FaHeart, FaRegComment } from 'react-icons/fa';
import { comentarioService } from '../services/api/Api';

function PerfilUsuario() {
  const [activeTab, setActiveTab] = useState('categorias');
  const [categorias, setCategorias] = useState([]);
  const [poesias, setPoesias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('recentes');
  const [curtidas, setCurtidas] = useState({});
  const [comentariosAbertos, setComentariosAbertos] = useState({});
  const [comentarios, setComentarios] = useState({});
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
        setCurtidas({});
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const poesiasOrdenadas = ordenarPoesias(data, sortOrder);
      setPoesias(poesiasOrdenadas);

      const curtidasObj = {};
      await Promise.all(
        poesiasOrdenadas.map(async (poesia) => {
          try {
            const qtd = await curtidaService.getContagemCurtidas(poesia.id);
            curtidasObj[poesia.id] = qtd;
          } catch {
            curtidasObj[poesia.id] = 0;
          }
        })
      );
      setCurtidas(curtidasObj);
    } catch (error) {
      console.error('Erro ao carregar poesias:', error);
      setPoesias([]);
      setCurtidas({});
    }
  };

  const ordenarPoesias = (poesias, ordem) => {
    if (ordem === 'maisCurtidas') {
      return [...poesias].sort((a, b) => (curtidas[b.id] || 0) - (curtidas[a.id] || 0));
    }
    if (ordem === 'menosCurtidas') {
      return [...poesias].sort((a, b) => (curtidas[a.id] || 0) - (curtidas[b.id] || 0));
    }
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

  const toggleComentarios = async (poesiaId) => {
    setComentariosAbertos(prev => ({ ...prev, [poesiaId]: !prev[poesiaId] }));
    if (!comentarios[poesiaId]) {
      try {
        const lista = await comentarioService.listarPorPoema(poesiaId);
        setComentarios(prev => ({ ...prev, [poesiaId]: lista }));
      } catch (e) {
        setComentarios(prev => ({ ...prev, [poesiaId]: [] }));
      }
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
                    <button
                      className={`sort-btn ${sortOrder === 'maisCurtidas' ? 'active' : ''}`}
                      onClick={() => handleSortChange('maisCurtidas')}
                    >
                      Mais Curtidas
                    </button>
                    <button
                      className={`sort-btn ${sortOrder === 'menosCurtidas' ? 'active' : ''}`}
                      onClick={() => handleSortChange('menosCurtidas')}
                    >
                      Menos Curtidas
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
                      <React.Fragment key={poesia.id}>
                        <div className="post" style={{ position: 'relative' }}>
                          <div style={{ textAlign: 'center', marginBottom: '10px', color: '#8899a6', fontSize: '0.9rem' }}>
                            {new Date(poesia.data).toLocaleDateString('pt-BR')} - {new Date(poesia.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="post-header" style={{ justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                            {poesia.titulo && (
                              <h4 className="post-titulo" style={{ margin: 0 }}>{poesia.titulo}</h4>
                            )}
                            {poesia.categoria && (
                              <span className="post-categoria">
                                {typeof poesia.categoria === 'object' && poesia.categoria !== null ? poesia.categoria.nome : poesia.categoria}
                              </span>
                            )}
                          </div>
                          <p className="post-conteudo" style={{ whiteSpace: 'pre-wrap' }}>{poesia.conteudo}</p>
                          <div className="post-actions" style={{ gap: '32px', marginTop: 15, paddingTop: 10, borderTop: '1px solid #2f3336', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                              <div className="action-btn" style={{ cursor: 'default' }}>
                                <FaRegHeart />
                                <span className="action-count">{curtidas[poesia.id] || 0}</span>
                              </div>
                              <button 
                                onClick={() => toggleComentarios(poesia.id)}
                                className="action-btn"
                              >
                                <FaRegComment />
                                <span>{comentarios[poesia.id]?.length || 0} comentários</span>
                              </button>
                            </div>
                            <button 
                              className="action-btn trash"
                              onClick={() => deletarPoesia(poesia.id)}
                            >
                              <IoTrashOutline size={16} />
                            </button>
                          </div>
                          {comentariosAbertos[poesia.id] && (
                            <div className="comentarios-container">
                              <div className="lista-comentarios">
                                {comentarios[poesia.id] && comentarios[poesia.id].length > 0 ? (
                                  comentarios[poesia.id].map(comentario => (
                                    <div key={comentario.id} className="comentario">
                                      <div className="comentario-header">
                                        <strong>{comentario.autor?.nome || 'Anônimo'}</strong>
                                        <span className="comentario-hora">
                                          {new Date(comentario.dataCriacao).toLocaleDateString('pt-BR')} {new Date(comentario.dataCriacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="comentario-texto">{comentario.texto}</p>
                                        {comentario.editado && (
                                          <span className="comentario-editado">(editado)</span>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Nenhum comentário ainda.</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </React.Fragment>
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