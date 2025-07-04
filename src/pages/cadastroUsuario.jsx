import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import Alerta from '../components/alerta/Alerta';
import './cadastroUsuario.css';

function CadastroUsuario() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    user: '',
    senha: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alerta, setAlerta] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  const navigate = useNavigate();

  const mostrarAlerta = (message, type = 'success') => {
    setAlerta({ show: true, message, type });
    setTimeout(() => {
      setAlerta(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const fecharAlerta = () => {
    setAlerta(prev => ({ ...prev, show: false }));
  };

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

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório!';
    } else if (formData.nome.length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres!';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório!';
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'E-mail inválido!';
      }
    }

    if (!formData.user.trim()) {
      newErrors.user = 'Nome de usuário é obrigatório!';
    } else if (formData.user.length < 3) {
      newErrors.user = 'Nome de usuário deve ter pelo menos 3 caracteres!';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.user)) {
      newErrors.user = 'Nome de usuário deve conter apenas letras, números e underscore!';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória!';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter no mínimo 6 caracteres!';
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
      const userData = {
        nome: formData.nome,
        email: formData.email,
        user: formData.user,
        acesso: {
          login: formData.email,
          senha: formData.senha
        }
      };

      const response = await fetch('http://localhost:8080/cadastro', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const result = await response.json();
        mostrarAlerta('Cadastro realizado com sucesso!', 'success');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        const errorData = await response.text();
        if (errorData.includes('Email já cadastrado')) {
          mostrarAlerta('E-mail já cadastrado!', 'error');
        } else {
          mostrarAlerta('Erro ao criar conta. Tente novamente!', 'error');
        }
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      mostrarAlerta('Erro de conexão. Verifique se o servidor está rodando!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Componente Alerta */}
      {alerta.show && (
        <Alerta 
          message={alerta.message} 
          type={alerta.type} 
          onClose={fecharAlerta}
        />
      )}
      
      <div className="register-card">
        <div className="register-header">
          <h1>Criar conta</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="nome">Nome completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              className={errors.nome ? 'error' : ''}
            />
            {errors.nome && <span className="field-error">{errors.nome}</span>}
          </div>
          
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
            <label htmlFor="user">Nome de usuário</label>
            <input
              type="text"
              id="user"
              name="user"
              value={formData.user}
              onChange={handleChange}
              placeholder="Digite seu nome de usuário"
              className={errors.user ? 'error' : ''}
            />
            {errors.user && <span className="field-error">{errors.user}</span>}
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
          
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>
            Já tem uma conta? <Link to="/">Voltar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CadastroUsuario;