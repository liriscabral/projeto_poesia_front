import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/button/Button';
import Alerta from '../../components/alerta/Alerta';
import { FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import './Cadastro.css';

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    user: '',
    senha: '',
    confirmarSenha: ''
  });
  
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validarFormulario = () => {
    const novosErros = {};
    
    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome completo é obrigatório';
    }
    
    if (!formData.email.trim()) {
      novosErros.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      novosErros.email = 'E-mail inválido';
    }
    
    if (!formData.user.trim()) {
      novosErros.user = 'Nome de usuário é obrigatório';
    }
    
    if (!formData.senha) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      novosErros.senha = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (formData.senha !== formData.confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setLoading(true);
    
    try {
      const usuarioDTO = {
        nome: formData.nome,
        email: formData.email,
        user: formData.user,
        acesso: {
          senha: formData.senha
        }
      };
      
      await axios.post('http://localhost:8080/cadastro', usuarioDTO);
      navigate('/login', { state: { registroSucesso: true } });
    } catch (error) {
      const mensagem = error.response?.data || 'Erro ao cadastrar. Tente novamente.';
      setErros({ ...erros, servidor: mensagem });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpa o erro quando o usuário começa a digitar
    if (erros[name]) {
      setErros({
        ...erros,
        [name]: null
      });
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h2>Crie sua conta</h2>
        <p>Junte-se à nossa comunidade de poetas</p>
        
        {erros.servidor && <Alerta message={erros.servidor} type="error" />}
        
        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${erros.nome ? 'error' : ''}`}>
            <FaUser className="input-icon" />
            <input
              type="text"
              name="nome"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            {erros.nome && <span className="error-message">{erros.nome}</span>}
          </div>
          
          <div className={`form-group ${erros.email ? 'error' : ''}`}>
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {erros.email && <span className="error-message">{erros.email}</span>}
          </div>
          
          <div className={`form-group ${erros.user ? 'error' : ''}`}>
            <FaUserTag className="input-icon" />
            <input
              type="text"
              name="user"
              placeholder="Nome de usuário"
              value={formData.user}
              onChange={handleChange}
              required
            />
            {erros.user && <span className="error-message">{erros.user}</span>}
          </div>
          
          <div className={`form-group ${erros.senha ? 'error' : ''}`}>
            <FaLock className="input-icon" />
            <input
              type="password"
              name="senha"
              placeholder="Senha (mínimo 6 caracteres)"
              value={formData.senha}
              onChange={handleChange}
              required
            />
            {erros.senha && <span className="error-message">{erros.senha}</span>}
          </div>
          
          <div className={`form-group ${erros.confirmarSenha ? 'error' : ''}`}>
            <FaLock className="input-icon" />
            <input
              type="password"
              name="confirmarSenha"
              placeholder="Confirme sua senha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
            />
            {erros.confirmarSenha && <span className="error-message">{erros.confirmarSenha}</span>}
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
            fullWidth
          >
            {loading ? 'Cadastrando...' : 'Criar conta'}
          </Button>
        </form>
        
        <div className="login-link">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </div>
      </div>
    </div>
  );
}