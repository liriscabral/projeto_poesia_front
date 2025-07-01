import React from 'react';
import './Post.css';

import { 
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark
} from 'react-icons/fa';
import { FiShare } from 'react-icons/fi';

function Post({ autor, conteudo, titulo = '', categoria = '' }) {
  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="post">
      <strong>{typeof autor === 'object' && autor !== null ? autor.user : autor}</strong>
      <div style={{ marginBottom: '6px' }}>
        {titulo && categoria ? (
          <h4 style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.5px' }}>
            {titulo} - {typeof categoria === 'object' && categoria !== null ? categoria.nome : categoria}
          </h4>
        ) : titulo ? (
          <h4 style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.5px' }}>{titulo}</h4>
        ) : categoria ? (
          <h4 style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.5px' }}>
            {typeof categoria === 'object' && categoria !== null ? categoria.nome : categoria}
          </h4>
        ) : null}
      </div>
      <p style={{ whiteSpace: 'pre-wrap' }}>{conteudo}</p>
      <div className="post-actions">
        <button onClick={() => setLiked(!liked)}>
          {liked ? <FaHeart color="#ff0000" /> : <FaRegHeart />}
          <span>Curtir</span>
        </button>
        <button>
          <FaRegComment />
          <span>Comentar</span>
        </button>
        <button onClick={() => setSaved(!saved)}>
          {saved ? <FaBookmark color="#000" /> : <FaRegBookmark />}
          <span>Salvar</span>
        </button>
      </div>
    </div>
  );
}


export default Post;