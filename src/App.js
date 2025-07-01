import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout.jsx';
import CadastroUsuario from './pages/cadastroUsuario';
import LoginUsuario from './pages/loginUsuario';
import PerfilUsuario from './pages/PerfilUsuario';
import EditarPerfil from './pages/EditarPerfil';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LoginUsuario />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            } />
            <Route path="/cadastro" element={<CadastroUsuario />} />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <PerfilUsuario />
              </ProtectedRoute>
            } />
            <Route path="/editar-perfil" element={
              <ProtectedRoute>
                <EditarPerfil />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
