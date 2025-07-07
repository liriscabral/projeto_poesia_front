import React, { useState } from 'react';
import './Post.css';
import { useAuth } from '../../contexts/AuthContext';
import { useSavedPosts } from '../../contexts/SavedPostsContext';
import { curtidaService, comentarioService } from '../../services/api/Api';
import Alerta from '../alerta/Alerta';
import { 
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
  FaTrash,
  FaEdit,
  FaCheck
} from 'react-icons/fa';

function Post({ id, autor, conteudo, titulo = '', categoria = '', data, isSavedView = false, onAction }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComentarios, setShowComentarios] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [editandoComentarioId, setEditandoComentarioId] = useState(null);
  const [textoEditado, setTextoEditado] = useState('');
  const [alerta, setAlerta] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  const { usuario } = useAuth();
  const { savedPosts, savePost, removeSavedPost, isPostSaved } = useSavedPosts();
  
  const isSaved = isPostSaved(id);
  const categoriaNome = typeof categoria === 'object' && categoria !== null ? categoria.nome : categoria;

  const mostrarAlerta = (message, type = 'success') => {
    setAlerta({ show: true, message, type });
    setTimeout(() => {
      setAlerta(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const fecharAlerta = () => {
    setAlerta(prev => ({ ...prev, show: false }));
  };

  React.useEffect(() => {
    const carregarDados = async () => {
      try {
        const [status, contagem, comentarios] = await Promise.all([
          curtidaService.getStatusCurtida(usuario.id, id),
          curtidaService.getContagemCurtidas(id),
          comentarioService.listarPorPoema(id)
        ]);
        setLiked(status);
        setLikeCount(contagem);
        setComentarios(comentarios);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarAlerta('Erro ao carregar dados do post', 'error');
      }
    };
    carregarDados();
  }, [id, usuario.id]);

  const formatarData = (comentario) => {
    const dataCriacao = new Date(comentario.dataCriacao);
    const horaCriacao = dataCriacao.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false  
    });

    if (comentario.editado && comentario.dataEdicao) {
      const dataEdicao = new Date(comentario.dataEdicao);
      const horaEdicao = dataEdicao.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      return (
        <span className="comentario-tempo">
          {horaCriacao} • <span className="comentario-editado">editado {horaEdicao}</span>
        </span>
      );
    }
    
    return <span className="comentario-tempo">{horaCriacao}</span>;
  };

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
      mostrarAlerta('Erro ao curtir/descurtir', 'error');
    }
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await removeSavedPost(id);
        mostrarAlerta('Poesia removida dos salvos', 'success');
        if (onAction) onAction('remove', true);
      } else {
        await savePost({
          id,
          autor,
          conteudo,
          titulo,
          categoria
        });
        mostrarAlerta('Poesia salva com sucesso!', 'success');
        if (onAction) onAction('save', true);
      }
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      mostrarAlerta('Erro ao salvar/remover poesia', 'error');
      if (onAction) onAction(isSaved ? 'remove' : 'save', false);
    }
  };

  const toggleComentarios = () => {
    setShowComentarios(!showComentarios);
  };

  const handleComentar = async () => {
    try {
      const comentario = await comentarioService.criarComentario({
        texto: novoComentario,
        autorId: usuario.id,
        poemaId: id
      });
      setComentarios([...comentarios, comentario]);
      setNovoComentario('');
      mostrarAlerta('Comentário adicionado!', 'success');
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      mostrarAlerta('Erro ao adicionar comentário', 'error');
    }
  };

  const iniciarEdicao = (comentario) => {
    setEditandoComentarioId(comentario.id);
    setTextoEditado(comentario.texto);
  };

  const salvarEdicao = async (comentarioId) => {
    try {
      const comentarioAtualizado = await comentarioService.editarComentario(comentarioId, {
        texto: textoEditado,
        autorId: usuario.id
      });
      
      setComentarios(comentarios.map(c => 
        c.id === comentarioId ? comentarioAtualizado : c
      ));
      setEditandoComentarioId(null);
      mostrarAlerta('Comentário editado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
      mostrarAlerta('Erro ao editar comentário', 'error');
    }
  };

  const deletarComentario = async (comentarioId) => {
    try {
      await comentarioService.deletarComentario(comentarioId, usuario.id);
      setComentarios(comentarios.filter(c => c.id !== comentarioId));
      mostrarAlerta('Comentário removido', 'success');
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      mostrarAlerta('Erro ao remover comentário', 'error');
    }
  };

  return (
    <div className="post">
      {/* Componente Alerta */}
      {alerta.show && (
        <Alerta 
          message={alerta.message} 
          type={alerta.type} 
          onClose={fecharAlerta}
        />
      )}
      
      {data && (
        <div style={{ textAlign: 'center', marginBottom: '10px', color: '#8899a6', fontSize: '0.9rem' }}>
          {new Date(data).toLocaleDateString('pt-BR')} - {new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
      
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
            <button 
              onClick={toggleComentarios}
              className="action-btn"
            >
              <FaRegComment />
              <span>{comentarios.length} comentários</span>
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

      {showComentarios && (
        <div className="comentarios-container">
          <div className="novo-comentario">
            <textarea
              placeholder="Escreva seu comentário..."
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              rows={2}
            />
            <button 
              onClick={handleComentar}
              disabled={!novoComentario.trim()}
              className="enviar-comentario-btn"
            >
              Comentar
            </button>
          </div>

          <div className="lista-comentarios">
            {comentarios.map(comentario => (
              <div key={comentario.id} className="comentario">
                <div className="comentario-header">
                  <strong>{comentario.autor.nome}</strong>
                  <span className="comentario-hora">
                    {formatarData(comentario)}
                  </span>
                  {comentario.autor.id === usuario.id && (
                    <div className="comentario-acoes">
                      {editandoComentarioId === comentario.id ? (
                        <button 
                          onClick={() => salvarEdicao(comentario.id)}
                          className="acao-btn"
                        >
                          <FaCheck />
                        </button>
                      ) : (
                        <button 
                          onClick={() => iniciarEdicao(comentario)}
                          className="acao-btn"
                        >
                          <FaEdit />
                        </button>
                      )}
                      <button 
                        onClick={() => deletarComentario(comentario.id)}
                        className="acao-btn"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
                
                {editandoComentarioId === comentario.id ? (
                  <textarea
                    value={textoEditado}
                    onChange={(e) => setTextoEditado(e.target.value)}
                    rows={2}
                    className="editar-comentario-input"
                  />
                ) : (
                  <div>
                    <p className="comentario-texto">{comentario.texto}</p>
                    {comentario.editado && (
                      <p className="comentario-editado"></p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;