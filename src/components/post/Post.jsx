import { useState, useRef, useEffect } from 'react';
import './Post.css';

import { 
  FaRegHeart,
  FaHeart,
  FaRegComment
} from 'react-icons/fa';

function Post({ autor, conteudo, titulo = '', categoria = '' }) {
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const element = contentRef.current;
      // Verifica se o conteúdo ultrapassa 2 linhas
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * 2;
      setHasOverflow(element.scrollHeight > maxHeight);
    }
  }, [conteudo]);

  return (
    <div className="post">
      <div className="post-header">
        <strong>{autor}</strong>
        {categoria && <span className="post-category">{categoria}</span>}
      </div>
      
      {titulo && <h4>{titulo}</h4>}
      
      <div 
        ref={contentRef}
        className={`post-content ${expanded ? 'expanded' : ''}`}
        style={{ whiteSpace: 'pre-line' }}
      >
        {conteudo}
        {hasOverflow && !expanded && (
          <span 
            className="read-more"
            onClick={() => setExpanded(true)}
          >
            Ler mais
          </span>
        )}
      </div>
      
      <div className="post-actions">
        <button onClick={() => setLiked(!liked)} aria-label={liked ? 'Descurtir' : 'Curtir'}>
          {liked ? <FaHeart color="#ff0000" /> : <FaRegHeart />}
          <span>{liked ? 'Curtido' : 'Curtir'}</span>
        </button>
        <button aria-label="Comentar">
          <FaRegComment />
          <span>Comentar</span>
        </button>
      </div>
    </div>
  );
}

export default Post;
