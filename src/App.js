import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import CadastroUsuario from './pages/cadastroUsuario';
import LoginUsuario from './pages/loginUsuario';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginUsuario />} />
          <Route path="/home" element={<Layout />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
