import React from 'react';
import Post from '../post/Post';
import './Feed.css';

function Feed({ poesias, isSavedView = false }) {
  return (
    <div className="feed">
      <div className="posts-container">
        {poesias.map((p, idx) => {
          // Adiciona @ ao autor
          const autorFormatado = typeof p.autor === 'object' && p.autor !== null
            ? { ...p.autor, user: p.autor.user.startsWith('@') ? p.autor.user : `@${p.autor.user}` }
            : (typeof p.autor === 'string' && p.autor.startsWith('@') ? p.autor : `@${p.autor}`);
          
          return (
            <Post 
              key={p.id || idx} 
              id={p.id}
              autor={autorFormatado} 
              conteudo={p.conteudo}
              titulo={p.titulo}
              categoria={p.categoria}
              isSavedView={isSavedView}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Feed;
