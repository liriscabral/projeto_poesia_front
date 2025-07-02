
import React from 'react';
import './Post.css';
import { useSavedPosts } from '../../contexts/SavedPostsContext';
import { 
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
  FaTrash
} from 'react-icons/fa';

function Post({ id, autor, conteudo, titulo = '', categoria = '', isSavedView = false }) {
  const [liked, setLiked] = React.useState(false);
  const { savedPosts, savePost, removeSavedPost } = useSavedPosts();
  
  const isSaved = savedPosts.some(post => post.id === id);

  const categoriaNome = typeof categoria === 'object' && categoria !== null ? categoria.nome : categoria;

  const handleSave = () => {
    if (isSaved) {
      removeSavedPost(id);
    } else {
      savePost({
        id,
        autor,
        conteudo,
        titulo,
        categoria
      });
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <strong>{typeof autor === 'object' && autor !== null ? autor.user : autor}</strong>
        {categoriaNome && (
          <span className="post-categoria">
            {categoriaNome}
          </span>
        )}
      </div>
      
      {titulo && (
        <h4 className="post-titulo">{titulo}</h4> 
      )}
      
      <p className="post-conteudo">{conteudo}</p>
      
      <div className="post-actions">
        {!isSavedView && (
          <>
            <button onClick={() => setLiked(!liked)}>
              {liked ? <FaHeart color="#ff0000" /> : <FaRegHeart />}
              <span>Curtir</span>
            </button>
            <button>
              <FaRegComment />
              <span>Comentar</span>
            </button>
          </>
        )}
        
        <button 
          onClick={handleSave}
          className={isSaved ? 'saved' : ''}
        >
          {isSavedView ? (
            <FaTrash color="#e0245e" />
          ) : isSaved ? (
            <FaBookmark color="#1da1f2" />
          ) : (
            <FaRegBookmark />
          )}
          <span>
            {isSavedView ? 'Remover' : isSaved ? 'Salvo' : 'Salvar'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default Post;