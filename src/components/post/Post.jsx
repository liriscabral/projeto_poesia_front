import React from 'react';
import './Post.css';
import { useAuth } from '../../contexts/AuthContext';
import { useSavedPosts } from '../../contexts/SavedPostsContext';
import { curtidaService } from '../../services/api/Api';
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
  const [likeCount, setLikeCount] = React.useState(0);
  const { usuario } = useAuth();
  const { savedPosts, savePost, removeSavedPost } = useSavedPosts();
  
  const isSaved = savedPosts.some(post => post.id === id);
  const categoriaNome = typeof categoria === 'object' && categoria !== null ? categoria.nome : categoria;

  React.useEffect(() => {
    const carregarCurtidas = async () => {
      try {
        const [status, contagem] = await Promise.all([
          curtidaService.getStatusCurtida(usuario.id, id),
          curtidaService.getContagemCurtidas(id)
        ]);
        setLiked(status);
        setLikeCount(contagem);
      } catch (error) {
        console.error('Erro ao carregar curtidas:', error);
      }
    };
    carregarCurtidas();
  }, [id, usuario.id]);

  const handleLike = async () => {
    try {
      if (liked) {
        await curtidaService.descurtirPoema(id, usuario.id);
        setLikeCount(prev => prev - 1);
      } else {
        await curtidaService.curtirPoema(id, usuario.id);
        setLikeCount(prev => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Erro ao atualizar curtida:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await removeSavedPost(id);
      } else {
        await savePost({
          id,
          autor,
          conteudo,
          titulo,
          categoria
        });
      }
    } catch (error) {
      console.error('Erro ao salvar post:', error);
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
            <button 
              onClick={handleLike}
              className={`action-btn ${liked ? 'liked' : ''}`}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span className="action-count">{likeCount}</span>
            </button>
            <button className="action-btn">
              <FaRegComment />
              <span>Comentar</span>
            </button>
          </>
        )}
        
        <button 
          onClick={handleSave}
          className={`action-btn ${isSaved ? (isSavedView ? 'trash' : 'saved') : ''}`}
        >
          {isSavedView ? (
            <FaTrash />
          ) : isSaved ? (
            <FaBookmark />
          ) : (
            <FaRegBookmark />
          )}
          <span>{isSavedView ? 'Remover' : isSaved ? 'Salvo' : 'Salvar'}</span>
        </button>
      </div>
    </div>
  );
}

export default Post;