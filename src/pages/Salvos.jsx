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
      <div className="saved-posts-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="saved-posts-title">Postagens Salvas</h1>
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
  );
}

export default Salvos;

