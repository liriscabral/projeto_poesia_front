import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline, IoEyeOutline, IoEyeOffOutline, IoWarningOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import './EditarPerfil.css';

function EditarPerfil() {
  const navigate = useNavigate();
  const { usuario, updateUser, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    nome: usuario?.nome || '',
    user: usuario?.user || '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.user.trim()) {
      newErrors.user = 'Nome de usuário é obrigatório';
    } else if (formData.user.length < 3) {
      newErrors.user = 'Nome de usuário deve ter pelo menos 3 caracteres';
    }

    // Se o usuário preencheu nova senha, deve preencher senha atual
    if (formData.novaSenha && !formData.senhaAtual) {
      newErrors.senhaAtual = 'Senha atual é obrigatória para alterar a senha';
    }

    // Se preencheu senha atual, deve preencher nova senha
    if (formData.senhaAtual && !formData.novaSenha) {
      newErrors.novaSenha = 'Nova senha é obrigatória';
    }

    if (formData.novaSenha && formData.novaSenha.length < 6) {
      newErrors.novaSenha = 'Nova senha deve ter pelo menos 6 caracteres';
    }

    if (formData.novaSenha && formData.novaSenha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
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
      const updateData = {
        nome: formData.nome,
        user: formData.user,
        email: usuario.email
      };

      // Só incluir senha se o usuário preencheu
      if (formData.senhaAtual && formData.novaSenha) {
        updateData.acesso = {
          login: formData.senhaAtual, // senha atual
          senha: formData.novaSenha   // nova senha
        };
      }

      const response = await fetch(`http://localhost:8080/cadastro/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        alert('Perfil atualizado com sucesso!');
        navigate('/perfil');
      } else {
        const errorData = await response.json();
        if (errorData.message) {
          alert(`Erro: ${errorData.message}`);
        } else {
          alert('Erro ao atualizar perfil');
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/perfil');
  };

  return (
    <div className="editar-perfil-container">
      <div className="editar-perfil-card">
        <div className="editar-perfil-header">
          <h1>Editar Perfil</h1>
          <button className="back-btn" onClick={handleVoltar}>
            <IoArrowBackOutline size={16} />
            Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="editar-perfil-form">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className={errors.nome ? 'error' : ''}
              placeholder="Seu nome completo"
            />
            {errors.nome && <span className="error-message">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="user">Nome de Usuário</label>
            <input
              type="text"
              id="user"
              name="user"
              value={formData.user}
              onChange={handleInputChange}
              className={errors.user ? 'error' : ''}
              placeholder="Seu nome de usuário"
            />
            {errors.user && <span className="error-message">{errors.user}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="senhaAtual">Senha Atual (opcional)</label>
            <div className="password-input">
              <input
                type={showSenhaAtual ? 'text' : 'password'}
                id="senhaAtual"
                name="senhaAtual"
                value={formData.senhaAtual}
                onChange={handleInputChange}
                className={errors.senhaAtual ? 'error' : ''}
                placeholder="Digite sua senha atual"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowSenhaAtual(!showSenhaAtual)}
              >
                {showSenhaAtual ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
              </button>
            </div>
            {errors.senhaAtual && <span className="error-message">{errors.senhaAtual}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="novaSenha">Nova Senha (opcional)</label>
            <div className="password-input">
              <input
                type={showNovaSenha ? 'text' : 'password'}
                id="novaSenha"
                name="novaSenha"
                value={formData.novaSenha}
                onChange={handleInputChange}
                className={errors.novaSenha ? 'error' : ''}
                placeholder="Digite a nova senha"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNovaSenha(!showNovaSenha)}
              >
                {showNovaSenha ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
              </button>
            </div>
            {errors.novaSenha && <span className="error-message">{errors.novaSenha}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
            <div className="password-input">
              <input
                type={showConfirmarSenha ? 'text' : 'password'}
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                className={errors.confirmarSenha ? 'error' : ''}
                placeholder="Confirme a nova senha"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
              >
                {showConfirmarSenha ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
              </button>
            </div>
            {errors.confirmarSenha && <span className="error-message">{errors.confirmarSenha}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditarPerfil; 