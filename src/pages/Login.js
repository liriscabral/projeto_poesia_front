import React, { useState } from 'react';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import '../css/Login.css';

function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erros, setErros] = useState({});

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarFormulario = () => {
    const novosErros = {};

    // Validar se o login está preenchido
    if (!login.trim()) {
      novosErros.login = 'O login é obrigatório';
    } 
    // Validar se a senha está preenchida
    if (!senha.trim()) {
      novosErros.senha = 'A senha é obrigatória';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
    };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem('');
    
    if (!validarFormulario()) {
      return;
    }

    try {
      const resposta = await fetch('http://localhost:8080/acesso/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha })
      });
      const texto = await resposta.text();
      if (resposta.ok) {
        setMensagem(texto);
      } else {
        setMensagem(texto);
      }
    } catch (erro) {
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="login-container">
      <h2>Verso Livre</h2>
      <form onSubmit={handleLogin}>
        <Campo
          label="Login"
          type="text"
          value={login}
          onChange={e => setLogin(e.target.value)}
          name="login"
          placeholder="Insira seu email"
        />
        {erros.login && <div className="erro-campo">{erros.login}</div>}
        
        <div className="campo-senha">
          <Campo
            label="Senha"
            type={mostrarSenha ? "text" : "password"}
            value={senha}
            onChange={e => setSenha(e.target.value)}
            name="senha"
            placeholder="Insira sua senha"
          />
          {senha && (
            <button 
              type="button" 
              className="botao-mostrar-senha"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="12" cy="12" rx="7" ry="5" stroke="#e7e9ea" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="2" fill="#e7e9ea" />
              </svg>
            </button>
          )}
        </div>
        {erros.senha && <div className="erro-campo">{erros.senha}</div>}
        
        <Botao texto="Entrar" tipo="submit" />
      </form>
      {mensagem && <div className="mensagem-login">{mensagem}</div>}
    </div>
  );
}

export default Login; 