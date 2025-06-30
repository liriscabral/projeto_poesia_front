import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import './loginUsuario.css';

function LoginUsuario() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório!';
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'E-mail inválido!';
      } else {
        const domain = formData.email.split('@')[1];
        const extension = domain.split('.').pop();
        const validExtensions = ['com', 'br', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'io', 'co', 'me', 'tv', 'info', 'biz', 'name', 'pro', 'museum', 'aero', 'coop', 'jobs', 'mobi', 'travel', 'cat', 'asia', 'tel', 'xxx', 'post', 'arpa', 'root', 'local', 'test', 'example', 'invalid', 'localhost'];
        
        if (!validExtensions.includes(extension.toLowerCase())) {
          newErrors.email = 'E-mail inválido!';
        }
      }
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const loginData = {
        login: formData.email,
        senha: formData.senha
      };

      console.log('Dados para login:', loginData);
      
      const response = await fetch('http://localhost:8080/acesso/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Login realizado com sucesso:', result);
        
        if (result.usuario) {
          login(result.usuario);
          setLoading(false);
          navigate('/home');
        } else {
          setLoading(false);
          setErrors({ submit: 'Erro: dados do usuário não recebidos!' });
        }
      } else {
        const errorData = await response.text();
        console.error('Erro no login:', errorData);
        setLoading(false);
        
        if (errorData.includes('Login ou senha inválidos')) {
          setErrors({ submit: 'E-mail ou senha incorretos!' });
        } else {
          setErrors({ submit: 'Erro ao fazer login. Tente novamente!' });
        }
      }

    } catch (error) {
      console.error('Erro na requisição:', error);
      setLoading(false);
      setErrors({ submit: 'Erro de conexão. Verifique se o servidor está rodando!' });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Verso Livre</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {errors.submit && <div className="error-message">{errors.submit}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Digite sua senha"
                className={errors.senha ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
              </button>
            </div>
            {errors.senha && <span className="field-error">{errors.senha}</span>}
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Não tem uma conta? <Link to="/cadastro">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginUsuario; 