import { useState, useEffect } from 'react';
import Post from '../post/Post';
import './Feed.css';
import { poesiaService } from '../../services/api/Api';

function Feed({ filtroAutor, modo = 'default' }) {
  const [poesias, setPoesias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarPoesias = async () => {
      try {
        setLoading(true);
        let poesiasBackend;

        if (filtroAutor) {
          poesiasBackend = await poesiaService.listarPoesiasPorAutorUsername(filtroAutor);
        } else {
          poesiasBackend = await poesiaService.listarPoesias();
        }

        // Mapeie os dados para o formato esperado
        setPoesias(poesiasBackend.map(poema => ({
          id: poema.id,
          titulo: poema.titulo,
          conteudo: poema.conteudo,
          autor: { nome: poema.autor?.nome || 'Autor desconhecido' },
          categoria: { 
            id: poema.categoria?.id,
            nome: poema.categoria?.nome 
          }
        })));
      } catch (err) {
        setError(err.message);
        console.error("Erro ao carregar poesias:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarPoesias();
  }, [filtroAutor]);

  if (loading) {
    return (
      <div className="feed">
        <div className="posts-container">
          <p>Carregando poesias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed">
        <div className="posts-container">
          <p className="error">Erro ao carregar poesias: {error}</p>
        </div>
      </div>
    );
  }

  if (!poesias.length) {
    return (
      <div className="feed">
        <div className="posts-container">
          <p>Nenhuma poesia encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`feed-container ${modo}`}>
      <div className="posts-container">
        {poesias.map((poesia) => (
          <Post 
            key={poesia.id}
            autor={poesia.autor?.nome || 'Autor desconhecido'}
            conteudo={poesia.conteudo}
            titulo={poesia.titulo}
            categoria={poesia.categoria?.nome}
          />
        ))}
      </div>
    </div>
  );
}

export default Feed;