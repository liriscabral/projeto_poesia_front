import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout.jsx';
import CadastroUsuario from './pages/cadastroUsuario';
import LoginUsuario from './pages/loginUsuario';
import PerfilUsuario from './pages/PerfilUsuario';
import Home from './pages/home/Home';
import MinhaPoesia from './pages/minhaPoesia/MinhaPoesia';
import Cadastro from './pages/cadastro/Cadastro';
import Explorar from './pages/explorar/Explorar';
import Perfil from './components/perfilAutor/PerfilAutor';
import Login from './pages/login/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/" element={<LoginUsuario />} />
            
            {/* Rotas protegidas */}
            <Route path="/home" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <PerfilUsuario />
              </ProtectedRoute>
            } />
            
            {/* Rotas dentro do Layout */}
            <Route path="/app" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Home />} />
              <Route path="explorar" element={<Explorar />} />
              <Route path="/perfil/:username" element={<Perfil />} />
              <Route path="minhas-poesias/:autorId" element={<MinhaPoesia />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
