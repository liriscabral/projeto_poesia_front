import React from 'react';
import Post from '../post/Post';
import './Feed.css';

function Feed({ poesias }) {
  return (
    <div className="feed">
      <div className="posts-container">
        {poesias.map((p, idx) => (
          <Post 
            key={idx} 
            autor={p.autor} 
            conteudo={p.conteudo}
            titulo={p.titulo}
            categoria={p.categoria}
          />
        ))}
      </div>
    </div>
  );
}

export default Feed;
