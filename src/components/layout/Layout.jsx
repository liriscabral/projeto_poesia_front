import React, {useState, useEffect} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';
import Sidebar from '../sidebar/Sidebar';
import Feed from '../feed/Feed';
import PostForm from '../Postform/Postform';

function Layout() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { usuario } = useAuth();

  const [poesias, setPoesias] = useState([
    { autor: 'William Sanhá', conteudo: 'A poesia é a alma que se derrama no papel.' },
    { autor: 'Delza', conteudo: 'Entre versos e rimas, construo meus sonhos.' },
    { autor: 'William Sanhá', conteudo: 'A poesia é a alma que se derrama no papel.' }
  ]);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const adicionarPoesia = (dados) => {
  const nova = { 
    autor: 'Você', 
    conteudo: dados.texto,
    titulo: dados.titulo,
    categoria: dados.categoria
  };
  setPoesias([nova, ...poesias]);
};

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{marginLeft: '260px', padding: '40px', maxWidth: '800px'}}>
        <div className="post-form-container">
          <PostForm onPublish={adicionarPoesia} usuarioId={usuario.id} />
        </div>
        <Feed poesias={poesias} />
      </div>
    </div>
  );
}

export default Layout;