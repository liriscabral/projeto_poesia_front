import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PerfilAutor from '../components/PerfilAutor';
import Feed from '../components/Feed';
import './Perfil.css';
import { usuarioService, poesiaService } from '../../services/api/Api';

const Perfil = () => {
  const { username } = useParams();
  const [autor, setAutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        setLoading(true);
        
        // Busca informações do usuário
        const usuarioEncontrado = await usuarioService.buscarUsuarioPorUsername(username);
        
        if (!usuarioEncontrado) {
          throw new Error('Usuário não encontrado');
        }

        // Busca poesias do usuário para contar
        const poesias = await poesiaService.listarPoesiasPorAutor(usuarioEncontrado.id);
        
        setAutor({
          nome: usuarioEncontrado.nome,
          user: usuarioEncontrado.username,
          email: usuarioEncontrado.email,
          bio: usuarioEncontrado.bio || "Este autor ainda não adicionou uma biografia.",
          totalPoesias: poesias.length,
          dataCadastro: usuarioEncontrado.dataCadastro
        });
      } catch (error) {
        setError(error.message);
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
  }, [username]);

  if (loading) return <div className="carregando">Carregando perfil...</div>;
  if (error) return <div className="erro">{error}</div>;
  if (!autor) return <div className="erro">Perfil não encontrado</div>;

  return (
    <div className="pagina-perfil">
      <div className="cabecalho-perfil">
        <PerfilAutor {...autor} />
      </div>

      <div className="conteudo-perfil">
        <h3>Poesias de {autor.nome}</h3>
        <Feed filtroAutor={username} />
      </div>
    </div>
  );
};

export default Perfil;