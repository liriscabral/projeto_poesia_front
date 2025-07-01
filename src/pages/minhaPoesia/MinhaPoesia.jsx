import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { poesiaService, usuarioService } from '../../services/api/Api';
import Feed from '../../components/feed/Feed';
import PostForm from '../../components/Postform/Postform'; 
import './MinhaPoesia.css'

export default function MinhaPoesia() {
  const { autorId } = useParams();
  const [poesias, setPoesias] = useState([]);
  const [autor, setAutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); 
  
  useEffect(() => {
  const carregarDados = async () => {
    try {
      console.log("Buscando poesias para o autor:", autorId);
      const [resPoesias, resAutor] = await Promise.all([
        poesiaService.listarPoesiasPorAutor(autorId),
        usuarioService.buscarPorId(autorId)
      ]);
      console.log("Poesias recebidas:", resPoesias);
      console.log("Autor recebido:", resAutor);
      setPoesias(resPoesias);
      setAutor(resAutor);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };
  carregarDados();
}, [autorId]);

  const handlePublish = async (dadosPoesia) => {
    try {
      const novaPoesia = await poesiaService.salvarPoesia(dadosPoesia);
      setPoesias([novaPoesia, ...poesias]); 
      setShowForm(false); 
      return novaPoesia;
    } catch (error) {
      throw error; 
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="minhas-poesias-page">
      <div className="page-header">
        <h3>Poesias de {autor?.nome}</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="new-poem-button"
        >
          {showForm ? 'Cancelar' : 'Nova Poesia'}
        </button>
      </div>
      
      {showForm && (
        <PostForm 
          onPublish={handlePublish}
          usuarioId={autorId} 
          onClose={() => setShowForm(false)}
        />
      )}
      
      <Feed 
        poesias={poesias} 
        modo="autor" 
        showActions={true}
      />
    </div>
  );
}