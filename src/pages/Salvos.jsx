import React, { useState } from 'react';
import { useSavedPosts } from '../contexts/SavedPostsContext';
import Feed from '../components/feed/Feed';
import Alerta from '../components/alerta/Alerta';
import './Salvos.css';

function Salvos() {
  const { savedPosts, loading, removeSavedPost } = useSavedPosts();
  const [alerta, setAlerta] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const mostrarAlerta = (message, type = 'success') => {
    setAlerta({ show: true, message, type });
    setTimeout(() => {
      setAlerta(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const fecharAlerta = () => {
    setAlerta(prev => ({ ...prev, show: false }));
  };

  const handleRemoveSavedPost = async (postId) => {
    try {
      await removeSavedPost(postId);
      mostrarAlerta('Poesia removida dos salvos com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao remover poesia salva:', error);
      mostrarAlerta('Erro ao remover poesia dos salvos', 'error');
    }
  };

  if (loading) {
    return (
      <div className="saved-posts-container">
        <div className="saved-posts-card">
          <div className="saved-posts-header">
            <h1 className="saved-posts-title">Poesias Salvas</h1>
          </div>
          <div className="saved-posts-content">
            <p>Carregando poesias salvas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-posts-container">
      {/* Componente Alerta */}
      {alerta.show && (
        <Alerta 
          message={alerta.message} 
          type={alerta.type} 
          onClose={fecharAlerta}
        />
      )}
      
      <div className="saved-posts-card">
        <div className="saved-posts-header">
          <h1 className="saved-posts-title">Poesias Salvas</h1>
        </div>
        <div className="saved-posts-content">
          {savedPosts.length === 0 ? (
            <div className="no-saved-posts">
              <p>Você ainda não salvou nenhuma poesia.</p>
              <p>Explore o feed e salve as poesias que mais gostar!</p>
            </div>
          ) : (
            <Feed
              poesias={savedPosts}
              isSavedView={true}
              onRemoveSavedPost={handleRemoveSavedPost}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Salvos;

