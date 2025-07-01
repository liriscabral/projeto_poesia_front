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
      <strong>{autor}</strong>
      {titulo && <h4>{titulo}</h4>}
      <p>{conteudo}</p>
      {categoria && <span className="post-category">{categoria}</span>}
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