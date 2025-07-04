import React from 'react';
import { useSavedPosts } from '../contexts/SavedPostsContext';
import Feed from '../components/feed/Feed';
import './Salvos.css';

function Salvos() {
  const { savedPosts, loading } = useSavedPosts();

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
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Salvos;

