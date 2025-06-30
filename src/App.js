import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import MinhaPoesia from './pages/minhaPoesia/MinhaPoesia';
import Layout from './components/layout/Layout';
import Cadastro from './pages/cadastro/Cadastro';

import Explorar from './pages/explorar/Explorar'
import Perfil from './components/perfilAutor/PerfilAutor';
import Login from './pages/login/Login'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="explorar" element={<Explorar />} />
          <Route path="/perfil/:username" element={<Perfil />} />
          <Route path="minhas-poesias/:autorId" element={<MinhaPoesia />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
