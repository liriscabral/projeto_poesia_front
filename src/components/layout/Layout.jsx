import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Layout.css';
import Sidebar from '../sidebar/Sidebar';
import Feed from '../feed/Feed';
import PostForm from '../Postform/Postform';
import Pesquisa from '../pesquisa/Pesquisa';
import Rightbar from '../rightbar/Righbar';
import { categoriaService } from '../../services/api/Api';

function Layout() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [poesias, setPoesias] = useState([
    { 
      autor: { nome: 'William Sanhá' }, 
      conteudo: 'A poesia é a alma que se derrama no papel.',
      titulo: 'Alma Poética',
      categoria: { id: '1', nome: 'Soneto' }
    },
    { 
      autor: { nome: 'Delza' }, 
      conteudo: 'Entre versos e rimas, construo meus sonhos.',
      titulo: 'Versos e Sonhos',
      categoria: { id: '2', nome: 'Haicai' }
    },
    { 
      autor: { nome: 'William Sanhá' }, 
      conteudo: 'A poesia é a alma que se derrama no papel.',
      titulo: 'Alma Poética II',
      categoria: { id: '3', nome: 'Poesia Livre' }
    }
  ]);

  const handleLogout = () => {
    navigate('/login');
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      }
    };

    const carregarCategorias = async () => {
      try {
        const categoriasBackend = await categoriaService.listarCategorias();
        setCategorias(categoriasBackend);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    handleResize();
    carregarCategorias();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const adicionarPoesia = (dados) => {
    const nova = { 
      autor: { nome: usuario?.nome || 'Você' }, 
      conteudo: dados.texto,
      titulo: dados.titulo,
      categoria: categorias.find(cat => cat.id === dados.categoriaId)
    };
    setPoesias([nova, ...poesias]);
    setShowForm(false);
  };

  const handleNovaCategoria = (novaCategoria) => {
    setCategorias(prev => [...prev, novaCategoria]);
  };

  const filtrarPoesias = () => {
    let poesiasFiltradas = poesias;
    
    if (searchTerm) {
      poesiasFiltradas = poesiasFiltradas.filter(poesia =>
        poesia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poesia.conteudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poesia.autor.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedFilter) {
      poesiasFiltradas = poesiasFiltradas.filter(poesia =>
        poesia.categoria.id === selectedFilter
      );
    }
    
    return poesiasFiltradas;
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {isMobile && (
        <button className="mobile-menu-button" onClick={toggleSidebar}>
          ☰
        </button>
      )}
      
      <main className="content">
        <div className="main-content">
          <div className="feed-container">
            <Pesquisa 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categorias={categorias}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              toggleFormVisibility={toggleFormVisibility}
            />
            
            {showForm && (
              <PostForm 
                onPublish={adicionarPoesia} 
                usuarioId={usuario?.id || 1}
                categorias={categorias}
                onCategoriaAdicionada={handleNovaCategoria}
              />
            )}
            
            <Feed poesias={filtrarPoesias()} />
          </div>
        </div>
      </main>
      
      <div className="rightbar-container">
        <Rightbar />
      </div>
    </div>
  );
}

export default Layout;