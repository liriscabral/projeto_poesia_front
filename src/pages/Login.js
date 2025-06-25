import React, { useState } from 'react';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import '../css/Login.css';

function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem('');
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
        <Campo
          label="Senha"
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          name="senha"
          placeholder="Insira sua senha"
        />
        <Botao texto="Entrar" tipo="submit" />
      </form>
      {mensagem && <div className="mensagem-login">{mensagem}</div>}
    </div>
  );
}

export default Login; 