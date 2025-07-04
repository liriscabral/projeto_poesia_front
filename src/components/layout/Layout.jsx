import React, {useState, useEffect} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';
import Sidebar from '../sidebar/Sidebar';
import Feed from '../feed/Feed';
import PostForm from '../Postform/Postform';
import { poemaService, curtidaService } from '../../services/api/Api';

function Layout() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { usuario } = useAuth();
  const [poesias, setPoesias] = useState([]);
  const [sortOrder, setSortOrder] = useState('recentes');
  const [curtidas, setCurtidas] = useState({});

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
    const fetchPoesias = async () => {
      try {
        const response = await poemaService.listarPoesias();
        // buscar curtidas de cada poesia
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
        const poesiasOrdenadas = ordenarPoesias(response, sortOrder, curtidasObj);
        setPoesias(poesiasOrdenadas);
      } catch (error) {
        setPoesias([]);
        setCurtidas({});
      }
    };
    fetchPoesias();
  }, [sortOrder]);

  const ordenarPoesias = (poesias, ordem, curtidasObj = curtidas) => {
    if (ordem === 'maisCurtidas') {
      return [...poesias].sort((a, b) => (curtidasObj[b.id] || 0) - (curtidasObj[a.id] || 0));
    }
    if (ordem === 'menosCurtidas') {
      return [...poesias].sort((a, b) => (curtidasObj[a.id] || 0) - (curtidasObj[b.id] || 0));
    }
    return [...poesias].sort((a, b) => {
      const dataA = new Date(a.data);
      const dataB = new Date(b.data);
      return ordem === 'recentes' ? dataB - dataA : dataA - dataB;
    });
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
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
          </div>
        </div>
        <Feed poesias={poesias} />
      </div>
    </div>
  );
}

export default Layout;