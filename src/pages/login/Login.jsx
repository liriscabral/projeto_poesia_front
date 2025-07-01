import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/button/Button';
import Alerta from '../../components/alerta/Alerta';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { usuarioService } from '../../services/api/Api';
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const navigate = useNavigate();

  const validarFormulario = () => {
    const novosErros = {};
    
    if (!formData.email.trim()) {
      novosErros.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      novosErros.email = 'E-mail inválido';
    }
    
    if (!formData.senha) {
      novosErros.senha = 'Senha é obrigatória';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setLoading(true);
    setMensagemErro('');
    
    try {
      const response = await usuarioService.login({
        email: formData.email,
        senha: formData.senha
      });
      
      // Armazena o token no localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      
      // Redireciona para a página inicial
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      setMensagemErro(error.response?.data?.mensagem || 'Erro ao fazer login. Verifique suas credenciais.');
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
    
    // Limpa o erro do campo quando o usuário começa a digitar
    if (erros[name]) {
      setErros({
        ...erros,
        [name]: null
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Faça seu login</h2>
        <p>Entre para compartilhar suas poesias</p>
        
        {mensagemErro && (
          <Alerta 
            message={mensagemErro} 
            type="error" 
            onClose={() => setMensagemErro('')}
          />
        )}
        
        <form onSubmit={handleSubmit} noValidate>
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
          
          <div className={`form-group ${erros.senha ? 'error' : ''}`}>
            <FaLock className="input-icon" />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
              required
            />
            {erros.senha && <span className="error-message">{erros.senha}</span>}
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
            fullWidth
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        
        <div className="register-link">
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
}