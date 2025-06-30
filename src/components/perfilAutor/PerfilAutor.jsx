
import { FaUser, FaCalendarAlt, FaPenAlt, FaEnvelope } from 'react-icons/fa';
import './PerfilAutor.css';

const PerfilAutor = ({ 
  nome, 
  user, 
  email, 
  bio, 
  totalPoesias = 0, 
  dataCadastro 
}) => {

  const formatarData = (dataString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="perfil-autor">
      <div className="perfil-header">
        <div className="avatar-placeholder">
          <FaUser className="avatar-icon" />
        </div>
        
        <div className="info-basica">
          <h2>{nome}</h2>
          <p className="username">@{user}</p>
        </div>
      </div>

      <div className="perfil-body">
        <div className="bio-container">
          <p className="bio-text">{bio || 'Este autor ainda não adicionou uma biografia.'}</p>
        </div>

        <div className="detalhes-contato">
          <div className="detalhe-item">
            <FaEnvelope className="detalhe-icon" />
            <span>{email}</span>
          </div>
          <div className="detalhe-item">
            <FaCalendarAlt className="detalhe-icon" />
            <span>Membro desde {formatarData(dataCadastro)}</span>
          </div>
        </div>

        <div className="estatisticas">
          <div className="estatistica-item">
            <FaPenAlt className="estatistica-icon" />
            <div>
              <span className="estatistica-valor">{totalPoesias}</span>
              <span className="estatistica-label">Poesias</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilAutor;