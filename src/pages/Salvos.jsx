import React from 'react';
import { useSavedPosts } from '../contexts/SavedPostsContext';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import Feed from '../components/feed/Feed';
import './Salvos.css';

function Salvos() {
  const { savedPosts } = useSavedPosts();
  const navigate = useNavigate();

  return (
    <div className="saved-posts-container">
      <div className="saved-posts-card">
        <div className="saved-posts-header">
          <button className="back-btn" onClick={() => navigate('/home')}>
            <IoArrowBack size={24} />
            Voltar
          </button>
          <h1 className="saved-posts-title">Poesias Salvas</h1>
        </div>
        <div className="saved-posts-content">
          {savedPosts.length === 0 ? (
            <div className="no-saved-posts">
              Você ainda não salvou nenhuma postagem
            </div>
          ) : (
            <Feed 
              poesias={savedPosts} 
              isSavedView={true} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Salvos;

