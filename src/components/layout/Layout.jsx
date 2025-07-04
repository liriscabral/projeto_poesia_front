import React, {useState, useEffect} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';
import Sidebar from '../sidebar/Sidebar';
import Feed from '../feed/Feed';
import PostForm from '../Postform/Postform';
import { poemaService, curtidaService, categoriaService } from '../../services/api/Api';
import { FaTimes } from 'react-icons/fa';

function Layout() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { usuario } = useAuth();
  const [poesias, setPoesias] = useState([]);
  const [sortOrder, setSortOrder] = useState('recentes');
  const [curtidas, setCurtidas] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState(null);

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
        
        // Aplicar filtro antes de ordenar
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
  };

  const limparFiltro = () => {
    setCategoriaFiltro(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const adicionarPoesia = async () => {
    try {
      const response = await poemaService.listarPoesias();
      const poesiasOrdenadas = ordenarPoesias(response, sortOrder);
      setPoesias(poesiasOrdenadas);
    } catch (error) {
      console.error('Erro ao recarregar poesias:', error);
    }
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="layout-main-card">
        <div className="post-form-container">
          <PostForm onPublish={adicionarPoesia} usuarioId={usuario.id} />
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
                onChange={(e) => setCategoriaFiltro(e.target.value || null)}
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
        <Feed poesias={poesias} />
      </div>
    </div>
  );
}

export default Layout;