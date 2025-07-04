import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';
import Sidebar from '../sidebar/Sidebar';
import Feed from '../feed/Feed';
import PostForm from '../Postform/Postform';
import { poemaService, curtidaService, categoriaService } from '../../services/api/Api';
import { FaTimes } from 'react-icons/fa';
import Alerta from '../alerta/Alerta';

function Layout() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { usuario } = useAuth();
  const [poesias, setPoesias] = useState([]);
  const [sortOrder, setSortOrder] = useState('recentes');
  const [curtidas, setCurtidas] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState(null);
  
  // Estado para controlar os alertas
  const [alerta, setAlerta] = useState({
    show: false,
    message: '',
    type: 'success' 
  });

  // Função para mostrar alerta
  const mostrarAlerta = (message, type = 'success') => {
    setAlerta({ show: true, message, type });
    setTimeout(() => {
      setAlerta(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Função para fechar alerta manualmente
  const fecharAlerta = () => {
    setAlerta(prev => ({ ...prev, show: false }));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const response = await categoriaService.listarCategorias();
        setCategorias(response);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        mostrarAlerta('Erro ao carregar categorias', 'error');
      }
    };
    carregarCategorias();
  }, []);

  useEffect(() => {
    const fetchPoesias = async () => {
      try {
        const response = await poemaService.listarPoesias();
        const curtidasObj = {};
        
        await Promise.all(
          response.map(async (poesia) => {
            try {
              const qtd = await curtidaService.getContagemCurtidas(poesia.id);
              curtidasObj[poesia.id] = qtd;
            } catch {
              curtidasObj[poesia.id] = 0;
            }
          })
        );
        
        setCurtidas(curtidasObj);
        
        let poesiasFiltradas = response;
        if (categoriaFiltro) {
          poesiasFiltradas = response.filter(poesia => 
            poesia.categoria && poesia.categoria.id === Number(categoriaFiltro)
          );
        }
        
        const poesiasOrdenadas = ordenarPoesias(poesiasFiltradas, sortOrder, curtidasObj);
        setPoesias(poesiasOrdenadas);
      } catch (error) {
        console.error('Erro ao carregar poesias:', error);
        mostrarAlerta('Erro ao carregar poesias', 'error');
        setPoesias([]);
        setCurtidas({});
      }
    };
    fetchPoesias();
  }, [sortOrder, categoriaFiltro]);

  const ordenarPoesias = (poesias, ordem, curtidasObj = curtidas) => {
    const poesiasOrdenadas = [...poesias];
    
    if (ordem === 'maisCurtidas') {
      return poesiasOrdenadas.sort((a, b) => (curtidasObj[b.id] || 0) - (curtidasObj[a.id] || 0));
    }
    if (ordem === 'menosCurtidas') {
      return poesiasOrdenadas.sort((a, b) => (curtidasObj[a.id] || 0) - (curtidasObj[b.id] || 0));
    }
    return poesiasOrdenadas.sort((a, b) => {
      const dataA = new Date(a.data);
      const dataB = new Date(b.data);
      return ordem === 'recentes' ? dataB - dataA : dataA - dataB;
    });
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    mostrarAlerta(`Ordenação alterada para ${getSortLabel(order)}`, 'success');
  };

  const getSortLabel = (order) => {
    switch(order) {
      case 'recentes': return 'Mais Recentes';
      case 'antigos': return 'Mais Antigos';
      case 'maisCurtidas': return 'Mais Curtidas';
      case 'menosCurtidas': return 'Menos Curtidas';
      default: return order;
    }
  };

  const limparFiltro = () => {
    setCategoriaFiltro(null);
    mostrarAlerta('Filtro removido', 'success');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const adicionarPoesia = async () => {
    try {
      const response = await poemaService.listarPoesias();
      const poesiasOrdenadas = ordenarPoesias(response, sortOrder);
      setPoesias(poesiasOrdenadas);
      mostrarAlerta('Poema publicado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao recarregar poesias:', error);
      mostrarAlerta('Erro ao atualizar o feed', 'error');
    }
  };

  return (
    <div className="layout">
      {/* Componente Alerta */}
      {alerta.show && (
        <Alerta 
          message={alerta.message} 
          type={alerta.type} 
          onClose={fecharAlerta}
        />
      )}
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="layout-main-card">
        <div className="post-form-container">
          <PostForm 
            onPublish={adicionarPoesia} 
            usuarioId={usuario.id} 
            mostrarAlerta={mostrarAlerta} // Passando a função para o PostForm
          />
        </div>
        <div className="feed-header">
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
            <div className="filter-container">
              <select
                value={categoriaFiltro || ''}
                onChange={(e) => {
                  setCategoriaFiltro(e.target.value || null);
                  if (e.target.value) {
                    mostrarAlerta(`Filtro aplicado: ${
                      categorias.find(c => c.id == e.target.value)?.nome
                    }`, 'success');
                  }
                }}
                className="filter-select"
              >
                <option value="">Filtrar categorias</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
              {categoriaFiltro && (
                <button 
                  onClick={limparFiltro}
                  className="clear-filter-btn"
                  type="button"
                  title="Limpar filtro"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>
        <Feed poesias={poesias} mostrarAlerta={mostrarAlerta} />
      </div>
    </div>
  );
}

export default Layout;